import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useAuth } from '../../hooks/useAuth'
import { MOCK_TODAY_QUESTS, MOCK_GOLDEN_CARDS } from '../../data/mockQuests'
import { MOCK_ISLAND } from '../../data/mockIsland'
import { MOCK_SESSIONS } from '../../data/mockCounseling'
import { MOCK_USER, RESILIENCE_TYPES } from '../../data/mockUser'
import { formatDate } from '../../utils/format'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const displayUser = user ?? MOCK_USER
  const typeInfo = RESILIENCE_TYPES[displayUser.resilienceTypeCode] ?? {}

  const [quests, setQuests] = useState(MOCK_TODAY_QUESTS)

  function toggleQuest(id) {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, done: !q.done } : q))
  }

  const doneCount = quests.filter(q => q.done).length

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p className="page-subtitle">오늘도 한 걸음씩, {formatDate(new Date().toISOString())}</p>
        <h1 className="page-title">안녕하세요, {displayUser.nickname}님</h1>
        <div style={{ marginTop: 12 }}>
          <span
            className="badge"
            style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.bg }}
          >
            <i className="bi bi-person-fill" style={{ marginRight: 4 }} />
            {typeInfo.label} · {typeInfo.strategy}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon sage"><i className="bi bi-check2-circle" style={{ color: 'var(--sage-500)', fontSize: 22 }} /></div>
          <div>
            <div className="stat-value">{displayUser.questsCompleted}</div>
            <div className="stat-label">완료한 퀘스트</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><i className="bi bi-fire" style={{ color: 'var(--amber-500)', fontSize: 22 }} /></div>
          <div>
            <div className="stat-value">{displayUser.streak}</div>
            <div className="stat-label">연속 실천 일수</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon terra"><i className="bi bi-graph-up-arrow" style={{ color: 'var(--terra-500)', fontSize: 22 }} /></div>
          <div>
            <div className="stat-value">{displayUser.confidenceScore}</div>
            <div className="stat-label">자신감 점수</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid-wide" style={{ marginBottom: 20 }}>
        {/* Today's Quests */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <i className="bi bi-lightning-charge-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
              오늘의 마이크로 퀘스트
            </span>
            <span className="card-badge">{doneCount}/{quests.length} 완료</span>
          </div>
          {quests.map(q => (
            <div className="quest-item" key={q.id}>
              <div
                className={`quest-checkbox${q.done ? ' done' : ''}`}
                onClick={() => toggleQuest(q.id)}
              >
                {q.done && <i className="bi bi-check-lg" />}
              </div>
              <div className="quest-info">
                <div className={`quest-name${q.done ? ' done' : ''}`}>{q.title}</div>
                <div className="quest-time">
                  <span className={`quest-level ${q.levelClass}`} style={{ marginRight: 6 }}>
                    Level {q.level}
                  </span>
                  {q.duration} · {q.types}
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 16, width: '100%' }}
            onClick={() => navigate('/action-items')}
          >
            전체 퀘스트 보기 <i className="bi bi-arrow-right" />
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
                {MOCK_ISLAND.questsCompleted} / {MOCK_ISLAND.totalQuests}
              </div>
            </div>
            <div className="island-ground" />
            {MOCK_ISLAND.trees.map(cls => (
              <div key={cls} className={`island-tree ${cls}`} style={{ bottom: 30 }}>
                <div className="crown" style={{ width: 40, height: 40 }} />
                <div className="trunk" style={{ height: 14 }} />
              </div>
            ))}
            <div className="flower f1" /><div className="flower f2" /><div className="flower f3" />
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
              진행률 {Math.round(MOCK_ISLAND.questsCompleted / MOCK_ISLAND.totalQuests * 100)}%
            </div>
            <div className="bar-track" style={{ width: 120 }}>
              <div
                className="bar-fill"
                style={{
                  width: `${MOCK_ISLAND.questsCompleted / MOCK_ISLAND.totalQuests * 100}%`,
                  background: 'var(--sage-500)',
                }}
              />
            </div>
          </div>
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
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/counseling')}
            >
              새 상담 <i className="bi bi-plus" />
            </button>
          </div>
          {MOCK_SESSIONS.map(s => (
            <div className="session-item" key={s.id} onClick={() => navigate('/counseling')}>
              <div className="session-dot" />
              <div className="session-name">{s.title}</div>
              <div className="session-date">{s.createdAt}</div>
              <i className="bi bi-chevron-right" style={{ color: 'var(--ink-300)', fontSize: 12 }} />
            </div>
          ))}
        </div>

        {/* Quick Actions + Golden Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card card-sm">
            <div className="card-header">
              <span className="card-title">빠른 시작</span>
            </div>
            <div className="quick-actions">
              {[
                { icon: 'bi-chat-heart', label: 'AI 상담 시작', path: '/counseling' },
                { icon: 'bi-joystick', label: 'VR 리허설', path: '/rehearsal' },
                { icon: 'bi-lightning-charge', label: '퀘스트 관리', path: '/action-items' },
                { icon: 'bi-people', label: '커뮤니티', path: '/community' },
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
            </div>
            {MOCK_GOLDEN_CARDS.slice(0, 2).map(({ id, title, detail }) => (
              <div key={id} className="gold-card" style={{ marginBottom: 8 }}>
                <div className="gold-icon" style={{ width: 36, height: 36, fontSize: 16 }}>
                  <i className="bi bi-star-fill" />
                </div>
                <div>
                  <div className="gold-title" style={{ fontSize: 13 }}>{title}</div>
                  <div className="gold-sub">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
