import { useState, useCallback } from 'react'
import {
  get_counseling_sessions,
  post_counseling_session,
  get_counseling_messages,
  post_counseling_message,
  patch_complete_counseling_session,
  get_counseling_analysis,
  delete_counseling_session,
} from '../api/counselingApi'

const unwrap = (res) => res.data?.data ?? res.data

const normalizeSession = (session) => ({
  ...session,
  createdAt: session.createdAt?.slice(0, 10) ?? '',
})

const normalizeMessage = (message) => ({
  ...message,
  role: message.role === 'ASSISTANT' ? 'ai' : 'user',
})

export function useCounseling() {
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [suggestClose, setSuggestClose] = useState(false)
  const [riskLevel, setRiskLevel] = useState(null)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const res = await get_counseling_sessions()
      const nextSessions = unwrap(res).map(normalizeSession)
      setSessions(nextSessions)
      return nextSessions
    } catch (err) {
      setSessions([])
      setError(err.response?.data?.message ?? '상담 내역을 불러오지 못했습니다.')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const startSession = useCallback(async (title) => {
    setLoading(true)
    setError('')
    setNotice('')
    setSuggestClose(false)
    setRiskLevel(null)
    try {
      const res = await post_counseling_session(title)
      const session = normalizeSession(unwrap(res))
      setSessions(prev => [session, ...prev])
      setActiveSession(session)
      setMessages([])
      setAnalysis(null)
      return session
    } catch (err) {
      setError(err.response?.data?.message ?? '새 상담을 시작하지 못했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const selectSession = useCallback(async (session) => {
    setActiveSession(session)
    setLoading(true)
    setError('')
    setNotice('')
    setSuggestClose(false)
    setRiskLevel(null)
    try {
      const msgRes = await get_counseling_messages(session.id)
      setMessages(unwrap(msgRes).map(normalizeMessage))

      if (session.status === 'COMPLETED') {
        try {
          const anRes = await get_counseling_analysis(session.id)
          setAnalysis(unwrap(anRes))
        } catch {
          setAnalysis(null)
        }
      } else {
        setAnalysis(null)
      }
    } catch (err) {
      setMessages([])
      setAnalysis(null)
      setError(err.response?.data?.message ?? '상담 메시지를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (content) => {
    setSending(true)
    setError('')
    setNotice('')

    const tempId = `temp-${Date.now()}`
    const userMsg = { id: tempId, role: 'user', content, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])

    try {
      let session = activeSession
      if (!session) {
        const res = await post_counseling_session('오늘의 상담')
        session = normalizeSession(unwrap(res))
        setSessions(prev => [session, ...prev])
        setActiveSession(session)
      }

      const res = await post_counseling_message(session.id, content)
      const { userMessage, assistantMessage, fallback, suggestClose: shouldClose, riskLevel: level } = unwrap(res)
      setMessages(prev => [
        ...prev.filter(message => message.id !== tempId),
        normalizeMessage(userMessage),
        normalizeMessage(assistantMessage),
      ])
      setSuggestClose(shouldClose ?? false)
      // HIGH는 한번 감지되면 세션 내내 유지
      if (level === 'HIGH') setRiskLevel('HIGH')
      else if (level) setRiskLevel(prev => prev === 'HIGH' ? 'HIGH' : level)
      if (fallback) {
        setNotice('AI API를 사용할 수 없어 임시 안전 응답으로 안내하고 있습니다.')
      }
    } catch (err) {
      setMessages(prev => prev.filter(message => message.id !== tempId))
      setError(err.response?.data?.message ?? '상담 답변을 생성하지 못했습니다.')
      throw err
    } finally {
      setSending(false)
    }
  }, [activeSession])

  const completeSession = useCallback(async () => {
    if (!activeSession) return null

    setLoading(true)
    setError('')
    setNotice('')
    try {
      const res = await patch_complete_counseling_session(activeSession.id)
      const nextAnalysis = unwrap(res)
      const completedSession = {
        ...activeSession,
        status: 'COMPLETED',
        ...(nextAnalysis.sessionTitle ? { title: nextAnalysis.sessionTitle } : {}),
      }
      setActiveSession(completedSession)
      setSessions(prev => prev.map(session => (
        session.id === completedSession.id ? completedSession : session
      )))
      setAnalysis(nextAnalysis)
      return nextAnalysis
    } catch (err) {
      setError(err.response?.data?.message ?? '상담 분석을 완료하지 못했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [activeSession])

  const dismissSuggestClose = useCallback(() => setSuggestClose(false), [])

  const deleteSession = useCallback(async (sessionId) => {
    setLoading(true)
    setError('')
    try {
      await delete_counseling_session(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (activeSession?.id === sessionId) {
        setActiveSession(null)
        setMessages([])
        setAnalysis(null)
      }
    } catch (err) {
      setError(err.response?.data?.message ?? '상담 내역을 삭제하지 못했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [activeSession])

  return {
    sessions,
    activeSession,
    messages,
    analysis,
    loading,
    sending,
    error,
    notice,
    suggestClose,
    riskLevel,
    fetchSessions,
    startSession,
    selectSession,
    sendMessage,
    completeSession,
    deleteSession,
    dismissSuggestClose,
  }
}
