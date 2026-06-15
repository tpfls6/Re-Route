import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORY_COLORS } from '../data/mockCommunity'
import {
  delete_campfire,
  delete_campfire_join,
  get_campfire_messages,
  get_campfires,
  get_community_posts,
  patch_campfire,
  post_campfire,
  post_campfire_join,
  post_campfire_message,
} from '../api/communityApi'

const emptyCampfire = { name: '', description: '', keyword: '', open: true }

export function useCommunity() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('board')
  const [joined, setJoined] = useState(null)
  const [filterCategory, setFilterCategory] = useState('전체')
  const [posts, setPosts] = useState([])
  const [campfires, setCampfires] = useState([])
  const [loading, setLoading] = useState(false)
  const [campfireForm, setCampfireForm] = useState(emptyCampfire)
  const [editingCampfireId, setEditingCampfireId] = useState(null)
  const [communityError, setCommunityError] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const chatEndRef = useRef(null)
  const chatInputRef = useRef(null)
  const pollRef = useRef(null)
  const lastMsgIdRef = useRef(null)

  const categories = ['전체', ...Object.keys(CATEGORY_COLORS)]

  useEffect(() => {
    loadPosts()
  }, [filterCategory])

  useEffect(() => {
    if (tab === 'campfire') loadCampfires()
  }, [tab])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    if (!joined) {
      clearInterval(pollRef.current)
      setChatMessages([])
      lastMsgIdRef.current = null
      return
    }
    loadMessages(joined.id)
    pollRef.current = setInterval(async () => {
      try {
        const res = await get_campfire_messages(joined.id, lastMsgIdRef.current)
        const newMsgs = res.data?.data ?? []
        if (newMsgs.length > 0) {
          lastMsgIdRef.current = newMsgs[newMsgs.length - 1].id
          setChatMessages(prev => [...prev, ...newMsgs])
        }
      } catch {}
    }, 3000)
    return () => clearInterval(pollRef.current)
  }, [joined])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await get_community_posts(filterCategory)
      setPosts(res.data.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function loadCampfires() {
    setLoading(true)
    try {
      const res = await get_campfires(false)
      setCampfires(res.data.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  function startEditCampfire(campfire) {
    setEditingCampfireId(campfire.id)
    setCampfireForm({
      name: campfire.name,
      description: campfire.description ?? campfire.desc,
      keyword: campfire.keyword,
      open: campfire.open,
    })
  }

  function resetCampfireForm() {
    setEditingCampfireId(null)
    setCampfireForm(emptyCampfire)
  }

  async function handleCampfireSubmit(e, { showAlert }) {
    e.preventDefault()
    setCommunityError('')
    const payload = {
      ...campfireForm,
      name: campfireForm.name.trim(),
      description: campfireForm.description.trim(),
      keyword: campfireForm.keyword.trim(),
    }
    if (!payload.name || !payload.description || !payload.keyword) return
    try {
      const res = editingCampfireId
        ? await patch_campfire(editingCampfireId, payload)
        : await post_campfire(payload)
      if (res.data.data.safetyNotice) await showAlert({ title: res.data.data.safetyNotice, type: 'safety' })
      resetCampfireForm()
      await loadCampfires()
    } catch (error) {
      setCommunityError(error.response?.data?.message ?? '캠프파이어를 저장하지 못했습니다.')
    }
  }

  async function handleCampfireDelete(campfireId, { confirm }) {
    const ok = await confirm({ icon: 'bi-fire', title: '캠프파이어 삭제', message: '캠프파이어를 삭제할까요?', confirmLabel: '삭제', danger: true })
    if (!ok) return
    await delete_campfire(campfireId)
    if (joined?.id === campfireId) setJoined(null)
    await loadCampfires()
  }

  async function loadMessages(campfireId) {
    try {
      const res = await get_campfire_messages(campfireId)
      const msgs = res.data?.data ?? []
      setChatMessages(msgs)
      lastMsgIdRef.current = msgs.length ? msgs[msgs.length - 1].id : null
    } catch {
      setChatMessages([])
    }
  }

  async function handleCampfireJoin(campfire) {
    try {
      const res = campfire.joined
        ? await delete_campfire_join(campfire.id)
        : await post_campfire_join(campfire.id)
      const updated = res.data.data
      setJoined(updated.joined ? updated : null)
      await loadCampfires()
    } catch (err) {
      setCommunityError(err.response?.data?.message ?? '캠프파이어 참여에 실패했습니다.')
    }
  }

  async function handleChatSend(e) {
    e?.preventDefault()
    const text = chatInput.trim()
    if (!text || chatSending || !joined) return
    setChatInput('')
    chatInputRef.current?.focus()
    setChatSending(true)
    try {
      const res = await post_campfire_message(joined.id, text)
      const msg = res.data?.data
      if (msg) {
        lastMsgIdRef.current = msg.id
        setChatMessages(prev => [...prev, msg])
      }
    } catch {
      setChatInput(text)
    } finally {
      setChatSending(false)
    }
  }

  function handleChatKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSend()
    }
  }

  return {
    navigate,
    tab,
    setTab,
    joined,
    setJoined,
    filterCategory,
    setFilterCategory,
    posts,
    campfires,
    loading,
    campfireForm,
    setCampfireForm,
    editingCampfireId,
    communityError,
    chatMessages,
    chatInput,
    setChatInput,
    chatSending,
    chatEndRef,
    chatInputRef,
    categories,
    startEditCampfire,
    resetCampfireForm,
    handleCampfireSubmit,
    handleCampfireDelete,
    handleCampfireJoin,
    handleChatSend,
    handleChatKeyDown,
  }
}
