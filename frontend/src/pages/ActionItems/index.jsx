import { useState } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { MOCK_ALL_QUESTS } from '../../data/mockQuests'

export default function ActionItems() {
  const [quests, setQuests] = useState(MOCK_ALL_QUESTS)
  const [filter, setFilter] = useState('all')

  function toggleDone(id) {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, done: !q.done } : q))
  }

  const filtered = filter === 'done'
    ? quests.filter(q => q.done)
    : filter === 'todo'
      ? quests.filter(q => !q.done)
      : quests

  const doneCount = quests.filter(q => q.done).length

  return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">마이크로 퀘스트</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            작은 실천이 큰 변화를 만듭니다 · {doneCount}/{quests.length} 완료
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'all', label: '전체' },
            { key: 'todo', label: '미완료' },
            { key: 'done', label: '완료' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="bar-track" style={{ height: 8, borderRadius: 100 }}>
          <div
            className="bar-fill"
            style={{
              width: `${(doneCount / quests.length) * 100}%`,
              background: 'var(--sage-500)',
            }}
          />
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-500)' }}>
          전체 진행률 {Math.round((doneCount / quests.length) * 100)}%
        </div>
      </div>

      <div className="action-items-grid">
        {filtered.map(q => (
          <div key={q.id} className={`action-item-card${q.done ? ' completed' : ''}`}>
            <div className="action-item-header">
              <span className={`quest-level ${q.levelClass}`}>{q.levelLabel} · {q.duration}</span>
              <div
                className={`action-item-check${q.done ? ' done' : ''}`}
                onClick={() => toggleDone(q.id)}
              >
                {q.done && <i className="bi bi-check-lg" />}
              </div>
            </div>
            <div className="quest-title" style={q.done ? { textDecoration: 'line-through', color: 'var(--ink-300)' } : {}}>
              {q.title}
            </div>
            <div className="quest-meta" style={{ marginTop: 8 }}>
              <i className="bi bi-person-fill" style={{ marginRight: 4, color: 'var(--sage-300)' }} />
              {q.types}
            </div>
            <div className="quest-meta" style={{ marginTop: 4 }}>
              <i className="bi bi-calendar3" style={{ marginRight: 4 }} />
              {q.assignedAt}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-check2-all" style={{ color: 'var(--sage-300)', fontSize: 48 }} /></div>
          <div className="empty-title">
            {filter === 'done' ? '아직 완료한 퀘스트가 없습니다' : '미완료 퀘스트가 없습니다'}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
