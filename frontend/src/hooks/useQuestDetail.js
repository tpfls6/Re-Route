import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get_quest_detail, skip_quest } from '../api/questApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useQuestDetail() {
  const { id } = useParams()
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [skipping, setSkipping] = useState(false)

  useEffect(() => {
    let mounted = true
    get_quest_detail(id)
      .then(res => { if (mounted) setQuest(unwrap(res)) })
      .catch(() => { if (mounted) setError('퀘스트를 불러오지 못했습니다.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function handleSkip(confirm) {
    const ok = await confirm({ icon: 'bi-skip-forward-fill', title: '퀘스트 건너뛰기', message: '이 퀘스트를 건너뛸까요?', confirmLabel: '건너뛰기' })
    if (!ok) return
    setSkipping(true)
    try {
      const res = await skip_quest(id)
      setQuest(unwrap(res))
    } catch {
      // ignore
    } finally {
      setSkipping(false)
    }
  }

  return { id, quest, loading, error, skipping, handleSkip }
}
