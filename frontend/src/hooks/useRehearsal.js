import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MOCK_SCENARIOS } from '../data/mockIsland'
import {
  get_rehearsal_history,
  get_rehearsal_scenarios,
  post_rehearsal_complete,
  post_rehearsal_turn,
} from '../api/rehearsalApi'

const SESSION_KEY = 'rehearsal_in_progress'
const HISTORY_PAGE_SIZE = 5

export function useRehearsal() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [scenarios, setScenarios] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(null)   // { feedback }
  const [suggestEnd, setSuggestEnd] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedResult, setSavedResult] = useState(null)  // { quest, id } | { error: true }
  const [userTurnCount, setUserTurnCount] = useState(0)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expandedHistoryIds, setExpandedHistoryIds] = useState(new Set())
  const [historyPage, setHistoryPage] = useState(1)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const historyRefs = useRef({}) // sessionId → DOM node

  // 마운트 시 진행 중 세션 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.selected && state.messages?.length > 0) {
          setSelected(state.selected)
          setMessages(state.messages)
          setUserTurnCount(state.userTurnCount ?? 0)
          setFinished(state.finished ?? null)
          setSavedResult(state.savedResult ?? null)
        }
      } catch {}
    }
    loadScenarios()
    loadHistory()
  }, [])

  // 대화 진행 중 sessionStorage에 상태 저장
  useEffect(() => {
    if (!selected) {
      sessionStorage.removeItem(SESSION_KEY)
      return
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      selected, messages, userTurnCount, finished, savedResult,
    }))
  }, [selected, messages, userTurnCount, finished, savedResult])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadScenarios() {
    try {
      const res = await get_rehearsal_scenarios()
      setScenarios(res.data?.data ?? MOCK_SCENARIOS)
    } catch {
      setScenarios(MOCK_SCENARIOS)
    }
  }

  async function loadHistory() {
    setHistoryLoading(true)
    try {
      const res = await get_rehearsal_history()
      const data = res.data?.data ?? []
      setHistory(data)

      // highlight 파라미터로 요청된 세션 자동 펼침
      const highlightId = Number(searchParams.get('highlight'))
      if (highlightId) {
        setExpandedHistoryIds(prev => new Set([...prev, highlightId]))
        // 해당 아이템이 몇 번째 페이지인지 계산해서 페이지 이동
        const idx = data.findIndex(h => h.id === highlightId)
        if (idx !== -1) {
          setHistoryPage(Math.floor(idx / HISTORY_PAGE_SIZE) + 1)
        }
      }
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  // historyPage가 올바른 페이지로 바뀐 뒤 DOM이 그려지면 스크롤
  useEffect(() => {
    if (historyLoading) return
    const highlightId = Number(searchParams.get('highlight'))
    if (!highlightId) return
    // 300ms: React state→render→paint 완료 시간 확보
    const timer = setTimeout(() => {
      const el = historyRefs.current[highlightId]
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
    return () => clearTimeout(timer)
  }, [historyPage, historyLoading, searchParams])

  function toggleHistory(id) {
    setExpandedHistoryIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function startScenario(scenario) {
    setSelected(scenario)
    setMessages([])
    setInput('')
    setFinished(null)
    setSuggestEnd(false)
    setSavedResult(null)
    setUserTurnCount(0)
    setLoading(true)
    try {
      const res = await post_rehearsal_turn(scenario.id, [])
      const { npcReply, isFinal, feedback } = res.data.data
      setMessages([{ role: 'npc', content: npcReply }])
      if (isFinal) setFinished({ feedback })
    } catch {
      setMessages([{ role: 'npc', content: '시나리오를 불러오지 못했어요. 다시 시도해주세요.' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading || finished) return
    const newUserMsg = { role: 'user', content: text }
    const nextMessages = [...messages, newUserMsg]
    setMessages(nextMessages)
    setInput('')
    inputRef.current?.focus()
    setLoading(true)
    const newTurnCount = userTurnCount + 1
    setUserTurnCount(newTurnCount)
    try {
      const msgHistory = nextMessages.map(m => ({ role: m.role, content: m.content }))
      const res = await post_rehearsal_turn(selected.id, msgHistory)
      const { npcReply, isFinal, suggestEnd: suggest, feedback } = res.data.data
      setMessages(prev => [...prev, { role: 'npc', content: npcReply }])
      if (isFinal) {
        setSuggestEnd(false)
        setFinished({ feedback })
      } else if (suggest) {
        setSuggestEnd(true)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'npc', content: '응답을 받지 못했어요. 다시 시도해주세요.' }])
    } finally {
      setLoading(false)
    }
  }

  async function handleComplete() {
    if (!selected || completing) return
    setSuggestEnd(false)
    setCompleting(true)
    try {
      const msgHistory = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await post_rehearsal_turn(selected.id, msgHistory, true)
      const { npcReply, feedback } = res.data.data
      setMessages(prev => [...prev, { role: 'npc', content: npcReply }])
      setFinished({ feedback })
    } catch {
      setFinished({ feedback: null })
    } finally {
      setCompleting(false)
    }
  }

  async function handleSave() {
    if (!selected || saving) return
    setSaving(true)
    try {
      const msgHistory = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await post_rehearsal_complete(
        selected.id, selected.name, msgHistory, finished?.feedback ?? null
      )
      const data = res.data?.data
      setSavedResult(data)
      loadHistory()
    } catch {
      setSavedResult({ error: true })
    } finally {
      setSaving(false)
    }
  }

  const highlightId = Number(searchParams.get('highlight'))
  const totalHistoryPages = Math.max(1, Math.ceil(history.length / HISTORY_PAGE_SIZE))
  const pagedHistory = history.slice(
    (historyPage - 1) * HISTORY_PAGE_SIZE,
    historyPage * HISTORY_PAGE_SIZE,
  )

  return {
    navigate,
    searchParams,
    scenarios,
    selected,
    setSelected,
    messages,
    input,
    setInput,
    loading,
    finished,
    suggestEnd,
    setSuggestEnd,
    completing,
    saving,
    savedResult,
    userTurnCount,
    history,
    historyLoading,
    expandedHistoryIds,
    historyPage,
    setHistoryPage,
    messagesEndRef,
    inputRef,
    historyRefs,
    toggleHistory,
    startScenario,
    handleKeyDown,
    handleSend,
    handleComplete,
    handleSave,
    highlightId,
    totalHistoryPages,
    pagedHistory,
    HISTORY_PAGE_SIZE,
  }
}
