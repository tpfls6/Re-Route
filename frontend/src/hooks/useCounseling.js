import { useState, useCallback } from 'react'
import {
  get_counseling_sessions,
  post_counseling_session,
  get_counseling_messages,
  post_counseling_message,
  get_counseling_analysis,
} from '../api/counselingApi'

export function useCounseling() {
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSessions = useCallback(async () => {
    try {
      const res = await get_counseling_sessions()
      setSessions(res.data)
    } catch {
      setSessions([])
    }
  }, [])

  const startSession = useCallback(async (title) => {
    setLoading(true)
    try {
      const res = await post_counseling_session(title)
      const session = res.data
      setSessions(prev => [session, ...prev])
      setActiveSession(session)
      setMessages([])
      setAnalysis(null)
      return session
    } finally {
      setLoading(false)
    }
  }, [])

  const selectSession = useCallback(async (session) => {
    setActiveSession(session)
    setLoading(true)
    try {
      const [msgRes, anRes] = await Promise.all([
        get_counseling_messages(session.id),
        get_counseling_analysis(session.id),
      ])
      setMessages(msgRes.data)
      setAnalysis(anRes.data)
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (content) => {
    if (!activeSession) return
    const userMsg = { role: 'user', content, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    try {
      const res = await post_counseling_message(activeSession.id, content)
      const { aiMessage, analysis: updatedAnalysis } = res.data
      setMessages(prev => [...prev, aiMessage])
      if (updatedAnalysis) setAnalysis(updatedAnalysis)
    } catch {
      setMessages(prev => prev.slice(0, -1))
    }
  }, [activeSession])

  return {
    sessions,
    activeSession,
    messages,
    analysis,
    loading,
    fetchSessions,
    startSession,
    selectSession,
    sendMessage,
  }
}
