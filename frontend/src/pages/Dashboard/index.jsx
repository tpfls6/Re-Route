import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useAuth } from '../../hooks/useAuth'
import { get_user_stats } from '../../api/userApi'
import { get_my_quests } from '../../api/questApi'
import { get_my_action_items, patch_complete_action_item } from '../../api/actionItemApi'
import { get_counseling_sessions } from '../../api/counselingApi'
import { formatDate } from '../../utils/format'

const RECOVERY_TYPE_INFO = {
  AVOIDANT:        { label: '회피형',    strategy: '단계적 노출', color: 'var(--terra-500)', bg: '#ffe8dc' },
  OVERFOCUSED:     { label: '과몰입형',  strategy: '리프레이밍', color: 'var(--amber-500)', bg: '#f4e5d0' },
  LETHARGIC:       { label: '무기력형',  strategy: '1분 과제',   color: 'var(--sage-700)',  bg: 'var(--sage-50)' },
  RELATION_ANXIOUS:{ label: '관계불안형',strategy: '대화 훈련', color: '#5a6b85',           bg: '#e5e8f0' },
  PERFECTIONIST:   { label: '완벽주의형',strategy: '실패 연습', color: '#8e5a8e',           bg: '#f0e5f0' },
}

const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }

const unwrap = (res) => res.data?.data ?? res.data

export default function Dashboard() {
  const navigate = useNavigate()
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
  const displayItems = [...completedItems, ...pendingItems].slice(0, 5)

  const completedQuests = quests.filter(q => q.status === 'COMPLETED')
  const totalQuests = quests.length
  const islandPct = totalQuests > 0 ? Math.round(completedQuests.length / totalQuests * 100) : 0

  const recentSessions = sessions.slice(0, 3)

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p className="page-subtitle">오늘도 한 걸음씩, {formatDate(new Date().toISOString())}</p>
        <h1 className="page-title">안녕하세요, {user?.nickname ?? ''}님</h1>
        {user?.primaryRecoveryType && (
          <div style={{ marginTop: 12 }}>
            <span
              className="badge"
              style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.bg }}
            >
              <i className="bi bi-person-fill" style={{ marginRight: 4 }} />
              {typeInfo.label} · {typeInfo.strategy}
            </span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon sage"><i className="bi bi-check2-circle" style={{ color: 'var(--sage-500)', fontSize: 22 }} /></div>
          <div>
            <div className="stat-value">{loading ? '—' : (stats?.questsCompleted ?? 0)}</div>
            <div className="stat-label">완료한 퀘스트</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><i className="bi bi-fire" style={{ color: 'var(--amber-500)', fontSize: 22 }} /></div>
          <div>
            <div className="stat-value">{loading ? '—' : (stats?.streakDays ?? 0)}</div>
            <div className="stat-label">연속 실천 일수</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon terra"><i className="bi bi-graph-up-arrow" style={{ color: 'var(--terra-500)', fontSize: 22 }} /></div>
          <div>
            <div className="stat-value">{loading ? '—' : (stats?.confidenceScore ?? 0)}</div>
            <div className="stat-label">자신감 점수</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid-wide" style={{ marginBottom: 20 }}>
        {/* Action Items */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <i className="bi bi-lightning-charge-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
              나의 액션 아이템
            </span>
            <span className="card-badge">
              {completedItems.length}/{actionItems.length} 완료
            </span>
          </div>
          {loading && (
            <div style={{ color: 'var(--ink-400)', fontSize: 13, padding: '8px 0' }}>불러오는 중...</div>
          )}
          {!loading && actionItemsError && (
            <div className="alert alert-error">{actionItemsError}</div>
          )}
          {!loading && !actionItemsError && actionItems.length === 0 && (
            <div style={{ color: 'var(--ink-400)', fontSize: 13, padding: '8px 0' }}>
              상담을 완료하면 맞춤 액션 아이템이 생성됩니다.
            </div>
          )}
          {displayItems.map(item => {
            const done = item.status === 'COMPLETED'
            return (
              <div className="quest-item" key={item.id}>
                <div
                  className={`quest-checkbox${done ? ' done' : ''}`}
                  onClick={() => !done && handleCompleteItem(item.id)}
                  style={{ cursor: done ? 'default' : 'pointer' }}
                >
                  {done && <i className="bi bi-check-lg" />}
                </div>
                <div className="quest-info">
                  <div className={`quest-name${done ? ' done' : ''}`}>{item.title}</div>
                  <div className="quest-time">
                    <span className={`quest-level ${DIFFICULTY_CLASS[item.difficulty] ?? 'ql1'}`} style={{ marginRight: 6 }}>
                      {item.formatName ?? item.format}
                    </span>
                    {item.estimatedMinutes}분 · {item.categoryName ?? item.category}
                  </div>
                </div>
              </div>
            )
          })}
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 16, width: '100%' }}
            onClick={() => navigate('/action-items')}
          >
            전체 보기 <i className="bi bi-arrow-right" />
          </button>
        </div>

        {/* Mind Island */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <i className="bi bi-tree" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
              마인드 아일랜드
            </span>
          </div>
          <div className="island-card-sm">
            <div className="island-stat" style={{ top: 12, left: 12, padding: '8px 12px' }}>
              <div className="island-stat-label">퀘스트</div>
              <div className="island-stat-value" style={{ fontSize: 18 }}>
                {completedQuests.length} / {totalQuests}
              </div>
            </div>
            <div className="island-ground" />
            {['t1', 't2', 't3'].slice(0, Math.max(1, Math.ceil(completedQuests.length / 2))).map(cls => (
              <div key={cls} className={`island-tree ${cls}`} style={{ bottom: 30 }}>
                <div className="crown" style={{ width: 40, height: 40 }} />
                <div className="trunk" style={{ height: 14 }} />
              </div>
            ))}
            <div className="flower f1" /><div className="flower f2" /><div className="flower f3" />
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
              진행률 {islandPct}%
            </div>
            <div className="bar-track" style={{ width: 120 }}>
              <div
                className="bar-fill"
                style={{ width: `${islandPct}%`, background: 'var(--sage-500)' }}
              />
            </div>
          </div>
          {totalQuests === 0 && (
            <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 8 }}>
              상담을 완료하면 AI가 퀘스트를 생성해줍니다.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="dashboard-grid">
        {/* Recent Sessions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <i className="bi bi-chat-heart" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
              최근 상담 세션
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/counseling')}>
              새 상담 <i className="bi bi-plus" />
            </button>
          </div>
          {loading && <div style={{ color: 'var(--ink-400)', fontSize: 13, padding: '8px 0' }}>불러오는 중...</div>}
          {!loading && recentSessions.length === 0 && (
            <div style={{ color: 'var(--ink-400)', fontSize: 13, padding: '8px 0' }}>아직 상담 내역이 없어요.</div>
          )}
          {recentSessions.map(s => (
            <div className="session-item" key={s.id} onClick={() => navigate('/counseling')}>
              <div className="session-dot" style={{ background: s.status === 'COMPLETED' ? 'var(--sage-500)' : 'var(--amber-400)' }} />
              <div className="session-name">{s.title}</div>
              <div className="session-date">{s.createdAt?.slice(0, 10) ?? ''}</div>
              <i className="bi bi-chevron-right" style={{ color: 'var(--ink-300)', fontSize: 12 }} />
            </div>
          ))}
        </div>

        {/* Quick Actions + Completed Quests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card card-sm">
            <div className="card-header">
              <span className="card-title">빠른 시작</span>
            </div>
            <div className="quick-actions">
              {[
                { icon: 'bi-chat-heart',      label: 'AI 상담 시작', path: '/onboarding' },
                { icon: 'bi-joystick',         label: 'VR 리허설',   path: '/rehearsal' },
                { icon: 'bi-lightning-charge', label: '퀘스트 관리', path: '/action-items' },
                { icon: 'bi-people',           label: '커뮤니티',    path: '/community' },
              ].map(({ icon, label, path }) => (
                <button key={path} className="quick-action-btn" onClick={() => navigate(path)}>
                  <i className={`bi ${icon} qa-icon`} style={{ fontSize: 20, color: 'var(--sage-700)' }} />
                  <span className="qa-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card card-sm">
            <div className="card-header">
              <span className="card-title">
                <i className="bi bi-star-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
                황금 카드
              </span>
              {completedQuests.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/golden-cards')}>
                  전체 보기 <i className="bi bi-arrow-right" />
                </button>
              )}
            </div>
            {completedQuests.length === 0 && (
              <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>아직 완료한 퀘스트가 없어요.</div>
            )}
            {completedQuests.slice(0, 2).map(q => (
              <div key={q.id} className="gold-card" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => navigate('/golden-cards')}>
                <div className="gold-icon" style={{ width: 36, height: 36, fontSize: 16 }}>
                  <i className="bi bi-star-fill" />
                </div>
                <div>
                  <div className="gold-title" style={{ fontSize: 13 }}>{q.title}</div>
                  <div className="gold-sub">
                    {q.recoveryTypeName} · {q.estimatedMinutes}분
                    {q.feeling && <span style={{ marginLeft: 6 }}>· {q.feeling === 'proud' ? '뿌듯' : q.feeling === 'okay' ? '괜찮음' : q.feeling === 'hard' ? '힘들었음' : '복잡'}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
