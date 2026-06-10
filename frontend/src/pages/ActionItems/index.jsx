import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { get_my_quests } from '../../api/questApi'

const unwrap = (res) => res.data?.data ?? res.data

const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }

export default function ActionItems() {
  const navigate = useNavigate()
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let mounted = true
    get_my_quests()
      .then(res => { if (mounted) setQuests(unwrap(res) ?? []) })
      .catch(() => { if (mounted) setError('퀘스트 목록을 불러오지 못했습니다.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const filtered = quests.filter(q => {
    if (filter === 'done') return q.status === 'COMPLETED'
    if (filter === 'todo') return q.status === 'PENDING'
    return true
  })

  const doneCount = quests.filter(q => q.status === 'COMPLETED').length
  const total = quests.length

  return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">마이크로 퀘스트</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            작은 실천이 큰 변화를 만듭니다 · {doneCount}/{total} 완료
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

      {total > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="bar-track" style={{ height: 8, borderRadius: 100 }}>
            <div className="bar-fill" style={{ width: `${(doneCount / total) * 100}%`, background: 'var(--sage-500)' }} />
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-500)' }}>
            전체 진행률 {total > 0 ? Math.round((doneCount / total) * 100) : 0}%
          </div>
        </div>
      )}

      {loading && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="spinner" /> 퀘스트를 불러오는 중...
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error">{error}</div>
      )}

      {!loading && !error && (
        <div className="action-items-grid">
          {filtered.map(q => {
            const done = q.status === 'COMPLETED'
            const skipped = q.status === 'SKIPPED'
            return (
              <div
                key={q.id}
                className={`action-item-card${done ? ' completed' : ''}`}
                onClick={() => navigate(`/quests/${q.id}`)}
              >
                <div className="action-item-header">
                  <span className={`quest-level ${DIFFICULTY_CLASS[q.difficulty] ?? 'ql1'}`}>
                    {q.difficultyLabel} · {q.estimatedMinutes}분
                  </span>
                  {done && (
                    <div className="action-item-check done">
                      <i className="bi bi-check-lg" />
                    </div>
                  )}
                  {skipped && (
                    <span style={{ fontSize: 11, color: 'var(--ink-400)', fontWeight: 600 }}>건너뜀</span>
                  )}
                </div>
                <div className="quest-title" style={done ? { textDecoration: 'line-through', color: 'var(--ink-300)' } : {}}>
                  {q.title}
                </div>
                <div className="quest-meta" style={{ marginTop: 8 }}>
                  <i className="bi bi-person-fill" style={{ marginRight: 4, color: 'var(--sage-300)' }} />
                  {q.recoveryTypeName}
                </div>
                <div className="quest-meta" style={{ marginTop: 4 }}>
                  <i className="bi bi-calendar3" style={{ marginRight: 4 }} />
                  {q.createdAt?.slice(0, 10)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-check2-all" style={{ color: 'var(--sage-300)', fontSize: 48 }} />
          </div>
          <div className="empty-title">
            {filter === 'done'
              ? '아직 완료한 퀘스트가 없습니다'
              : filter === 'todo'
                ? '미완료 퀘스트가 없습니다'
                : '상담을 마치면 퀘스트가 생성됩니다'}
          </div>
          {filter === 'all' && (
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/counseling')}>
              <i className="bi bi-robot" /> 상담 시작하기
            </button>
          )}
        </div>
      )}
    </AppLayout>
  )
}
