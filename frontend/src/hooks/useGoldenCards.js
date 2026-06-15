import { useState, useEffect } from 'react'
import { get_my_quests } from '../api/questApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useGoldenCards() {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    get_my_quests()
      .then(res => {
        if (!mounted) return
        const all = unwrap(res) ?? []
        setQuests(all.filter(q => q.status === 'COMPLETED'))
      })
      .catch(err => {
        if (mounted) setError(err.response?.data?.message ?? '황금 카드를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return {
    quests,
    loading,
    selected,
    setSelected,
    error,
  }
}
