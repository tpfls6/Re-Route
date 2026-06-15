import { useEffect, useState } from 'react'
import { get_my_quests, complete_quest } from '../api/questApi'

export const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }
export const STATUS_LABEL = { PENDING: '진행 중', COMPLETED: '완료', SKIPPED: '건너뜀' }
export const PAGE_SIZE = 10

export function useQuests() {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [sourceTab, setSourceTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [completing, setCompleting] = useState(null)

  useEffect(() => {
    get_my_quests()
      .then(res => setQuests(res.data?.data ?? []))
      .catch(() => setQuests([]))
      .finally(() => setLoading(false))
  }, [])

  // tab 변경 시 페이지 초기화
  useEffect(() => { setPage(1) }, [sourceTab, statusFilter])

  const counselingCount = quests.filter(q => q.sourceType === 'COUNSELING').length
  const rehearsalCount  = quests.filter(q => q.sourceType === 'REHEARSAL').length
  const doneCount       = quests.filter(q => q.status === 'COMPLETED').length

  const filtered = quests
    .filter(q => {
      const tabMatch =
        sourceTab === 'all' ||
        (sourceTab === 'counseling' && q.sourceType === 'COUNSELING') ||
        (sourceTab === 'rehearsal'  && q.sourceType === 'REHEARSAL')
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'done'    && q.status === 'COMPLETED') ||
        (statusFilter === 'pending' && q.status !== 'COMPLETED')
      return tabMatch && statusMatch
    })
    .sort((a, b) => {
      const aWeight = a.status === 'COMPLETED' ? 1 : 0
      const bWeight = b.status === 'COMPLETED' ? 1 : 0
      return aWeight - bWeight
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleComplete(e, questId) {
    e.stopPropagation()
    if (completing) return
    setCompleting(questId)
    try {
      await complete_quest(questId)
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'COMPLETED' } : q))
    } catch {
      // ignore
    } finally {
      setCompleting(null)
    }
  }

  return {
    quests,
    loading,
    sourceTab,
    setSourceTab,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    paged,
    totalPages,
    completing,
    handleComplete,
    counselingCount,
    rehearsalCount,
    doneCount,
  }
}
