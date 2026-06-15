import { useEffect, useState } from 'react'
import { get_my_action_items } from '../api/actionItemApi'

const unwrap = (res) => res.data?.data ?? res.data

export function useActionItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let mounted = true
    get_my_action_items()
      .then(res => { if (mounted) setItems(unwrap(res) ?? []) })
      .catch(() => { if (mounted) setError('액션 아이템 목록을 불러오지 못했습니다.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const displayItems = items.filter(i => {
    if (filter === 'done') return i.status === 'COMPLETED'
    if (filter === 'todo') return i.status === 'PENDING' || i.status === 'IN_PROGRESS'
    return true
  })

  const doneCount = items.filter(i => i.status === 'COMPLETED').length
  const totalCount = items.length
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return {
    items,
    loading,
    error,
    filter,
    setFilter,
    displayItems,
    doneCount,
    totalCount,
    progressPct,
  }
}
