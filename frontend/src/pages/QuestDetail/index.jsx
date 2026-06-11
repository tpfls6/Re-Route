import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useModal } from '../../components/common/Modal'
import { get_quest_detail, skip_quest } from '../../api/questApi'

const unwrap = (res) => res.data?.data ?? res.data
const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }

export default function QuestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { confirm, ModalElement } = useModal()
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

  async function onSkip() {
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

  if (loading) {
    return (
      <AppLayout>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="spinner" /> 퀘스트를 불러오는 중...
        </div>
      </AppLayout>
    )
  }

  if (error || !quest) {
    return (
      <AppLayout>
        <div className="alert alert-error">{error || '퀘스트를 찾을 수 없습니다.'}</div>
        <button className="btn btn-ghost" onClick={() => navigate('/action-items')}>목록으로</button>
      </AppLayout>
    )
  }

  const done = quest.status === 'COMPLETED'
  const skipped = quest.status === 'SKIPPED'

  return (
    <AppLayout>
      {ModalElement}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/action-items')} style={{ marginBottom: 24 }}>
        <i className="bi bi-arrow-left" /> 퀘스트 목록으로
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--sage-50), var(--bg-cream))' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <span className={`quest-level ${DIFFICULTY_CLASS[quest.difficulty] ?? 'ql1'}`}>
            {quest.difficultyLabel} · {quest.estimatedMinutes}분
          </span>
          {done && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 100,
              background: 'var(--sage-50)', color: 'var(--sage-700)',
              border: '1px solid var(--sage-100)', fontSize: 12, fontWeight: 700,
            }}>
              <i className="bi bi-check-circle-fill" /> 완료됨
            </span>
          )}
          {skipped && (
            <span style={{
              padding: '4px 12px', borderRadius: 100,
              background: 'var(--line)', color: 'var(--ink-400)',
              fontSize: 12, fontWeight: 700,
            }}>건너뜀</span>
          )}
        </div>
        <h1 className="page-title" style={{ marginBottom: 10 }}>{quest.title}</h1>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-person-fill" style={{ color: 'var(--sage-300)' }} /> {quest.recoveryTypeName}
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-calendar3" /> 생성일 {quest.createdAt?.slice(0, 10)}
          </span>
        </div>
        <div style={{
          padding: '14px 18px',
          background: 'rgba(110,154,101,0.08)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--sage-300)',
          fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6,
        }}>
          <i className="bi bi-robot" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
          {quest.background}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>
            <i className="bi bi-question-circle-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
            이 퀘스트를 하는 이유
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.7 }}>{quest.why}</p>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>
            <i className="bi bi-lightbulb-fill" style={{ color: 'var(--amber-300)', marginRight: 6 }} />
            도움이 되는 팁
          </div>
          <ul style={{ listStyle: 'none' }}>
            {quest.tips?.map((tip, i) => (
              <li key={i} style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '6px 0', borderBottom: i < quest.tips.length - 1 ? '1px solid var(--line)' : 'none',
                fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.5,
              }}>
                <span style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--amber-300)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, marginTop: 1,
                }}>{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Steps */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title" style={{ marginBottom: 20 }}>
          <i className="bi bi-list-ol" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
          진행 방법
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {quest.steps?.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--sage-700)', color: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                }}>{i + 1}</div>
                {i < quest.steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 28, background: 'var(--line)', margin: '4px 0' }} />
                )}
              </div>
              <div style={{
                paddingBottom: i < quest.steps.length - 1 ? 24 : 0,
                paddingTop: 6,
                fontSize: 15, color: 'var(--ink-900)', lineHeight: 1.6,
              }}>{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {done ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-lg" style={{ flex: 1 }} onClick={() => navigate('/action-items')}>목록으로</button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => navigate(`/quests/${id}/complete`)}>
            <i className="bi bi-journal-text" /> 회고 작성
          </button>
        </div>
      ) : skipped ? (
        <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} onClick={() => navigate('/action-items')}>목록으로</button>
      ) : (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-lg" style={{ flex: 1 }} onClick={onSkip} disabled={skipping}>
            {skipping ? '처리 중...' : '나중에 하기'}
          </button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => navigate(`/quests/${id}/complete`)}>
            <i className="bi bi-check-circle-fill" /> 퀘스트 완료했어요
          </button>
        </div>
      )}
    </AppLayout>
  )
}
