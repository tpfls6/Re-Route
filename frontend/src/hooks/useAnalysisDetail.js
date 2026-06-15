import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get_counseling_analysis, get_counseling_messages } from '../api/counselingApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useAnalysisDetail() {
  const { sessionId } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState(null)   // null = 미로드, [] = 없음
  const [msgLoading, setMsgLoading] = useState(false)
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchAnalysis() {
      setLoading(true)
      setError('')
      try {
        const res = await get_counseling_analysis(sessionId)
        if (mounted) setAnalysis(unwrap(res))
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message ?? '상담 분석 결과를 불러오지 못했습니다.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchAnalysis()
    return () => { mounted = false }
  }, [sessionId])

  async function handleToggleMessages() {
    if (showMessages) { setShowMessages(false); return }
    setShowMessages(true)
    if (messages !== null) return
    setMsgLoading(true)
    try {
      const res = await get_counseling_messages(sessionId)
      setMessages(res.data?.data ?? res.data ?? [])
    } catch {
      setMessages([])
    } finally {
      setMsgLoading(false)
    }
  }

  return {
    sessionId,
    analysis,
    loading,
    error,
    messages,
    msgLoading,
    showMessages,
    handleToggleMessages,
  }
}
