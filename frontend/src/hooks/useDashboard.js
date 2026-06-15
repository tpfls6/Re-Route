import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { get_user_stats } from '../api/userApi'
import { get_my_quests } from '../api/questApi'
import { get_my_action_items, patch_complete_action_item } from '../api/actionItemApi'
import { get_counseling_sessions } from '../api/counselingApi'

export const RECOVERY_TYPE_INFO = {
  AVOIDANT:         { label: '회피형',    strategy: '단계적 노출', color: 'var(--terra-500)', bg: '#ffe8dc' },
  OVERFOCUSED:      { label: '과몰입형',  strategy: '리프레이밍', color: 'var(--amber-500)', bg: '#f4e5d0' },
  LETHARGIC:        { label: '무기력형',  strategy: '1분 과제',   color: 'var(--sage-700)',  bg: 'var(--sage-50)' },
  RELATION_ANXIOUS: { label: '관계불안형',strategy: '대화 훈련', color: '#5a6b85',           bg: '#e5e8f0' },
  PERFECTIONIST:    { label: '완벽주의형',strategy: '실패 연습', color: '#8e5a8e',           bg: '#f0e5f0' },
}

export const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }

const unwrap = (res) => res.data?.data ?? res.data

export function useDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [quests, setQuests] = useState([])
  const [actionItems, setActionItems] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionItemsError, setActionItemsError] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const [statsRes, questsRes, itemsRes, sessionsRes] = await Promise.allSettled([
        get_user_stats(),
        get_my_quests(),
        get_my_action_items(),
        get_counseling_sessions(),
      ])
      if (statsRes.status === 'fulfilled') setStats(unwrap(statsRes.value))
      if (questsRes.status === 'fulfilled') setQuests(unwrap(questsRes.value) ?? [])
      if (itemsRes.status === 'fulfilled') {
        setActionItems(unwrap(itemsRes.value) ?? [])
      } else {
        setActionItemsError(itemsRes.reason?.response?.data?.message ?? '액션 아이템을 불러오지 못했습니다.')
      }
      if (sessionsRes.status === 'fulfilled') setSessions(unwrap(sessionsRes.value) ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleCompleteItem(id) {
    try {
      await patch_complete_action_item(id)
      setActionItems(prev => prev.map(it => it.id === id ? { ...it, status: 'COMPLETED' } : it))
      setStats(prev => prev ? { ...prev, actionItemsCompleted: prev.actionItemsCompleted + 1 } : prev)
    } catch {
      // silently ignore
    }
  }

  const typeInfo = RECOVERY_TYPE_INFO[user?.primaryRecoveryType] ?? {}

  const pendingItems = actionItems.filter(it => it.status !== 'COMPLETED' && it.status !== 'SKIPPED')
  const completedItems = actionItems.filter(it => it.status === 'COMPLETED')
  const latestItem = pendingItems[0] ?? completedItems[0] ?? null

  const completedQuests = quests.filter(q => q.status === 'COMPLETED')
  const totalQuests = quests.length
  const islandPct = totalQuests > 0 ? Math.round(completedQuests.length / totalQuests * 100) : 0

  const recentSessions = sessions.slice(0, 6)

  return {
    user,
    stats,
    quests,
    actionItems,
    loading,
    actionItemsError,
    handleCompleteItem,
    typeInfo,
    pendingItems,
    completedItems,
    latestItem,
    completedQuests,
    totalQuests,
    islandPct,
    recentSessions,
  }
}
