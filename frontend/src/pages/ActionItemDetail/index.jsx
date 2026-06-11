import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { patch_complete_action_item } from '../../api/actionItemApi'

const unwrap = (res) => res.data?.data ?? res.data

const CATEGORY_CLASS = {
  AVOIDANT: 'ql1',
  OVERFOCUSED: 'ql2',
  LETHARGIC: 'ql3',
  RELATION_ANXIOUS: 'ql2',
  PERFECTIONIST: 'ql1',
}

const FORMAT_TIPS = {
  MICRO_ACTION: ['완벽하게 하려 하지 말고 일단 시작에만 집중하세요', '1분도 충분합니다. 타이머를 맞춰보세요', '완료 후 어떤 기분인지 잠깐 느껴보세요'],
  REFLECTION_PROMPT: ['판단 없이 떠오르는 대로 적어보세요', '쓰기 어려우면 단어만 적어도 괜찮습니다', '완성된 문장이 아니어도 됩니다'],
  TIME_BOX: ['타이머를 직접 맞추는 것이 효과적입니다', '시간이 끝나면 즉시 멈추는 연습도 중요합니다', '짧은 시간도 충분히 의미 있습니다'],
  GROUNDING: ['주변 환경에 집중하면 생각이 잠시 멈춥니다', '천천히, 의식적으로 진행해보세요', '효과가 바로 느껴지지 않아도 괜찮습니다'],
  RELATION_REFRAME: ['한 가지 해석에만 고집하지 않는 연습입니다', '틀린 해석이 없습니다. 다양하게 써보세요', '상대방의 입장을 상상해보는 것이 도움됩니다'],
  IMPERFECT_START: ['60점짜리 시작이 0점짜리 완벽함보다 낫습니다', '지금 상태 그대로 시작해도 괜찮습니다', '부족해도 괜찮다는 것을 스스로 허락해보세요'],
}

export default function ActionItemDetail() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [item, setItem] = useState(state?.item ?? null)
  const [completing, setCompleting] = useState(false)

  if (!item) {
    return (
      <AppLayout>
        <div className="alert alert-error">액션 아이템 정보를 찾을 수 없습니다.</div>
        <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/action-items')}>
          목록으로
        </button>
      </AppLayout>
    )
  }

  const done = item.status === 'COMPLETED'
  const skipped = item.status === 'SKIPPED'
  const tips = FORMAT_TIPS[item.format] ?? []

  async function handleComplete() {
    setCompleting(true)
    try {
      const res = await patch_complete_action_item(item.id)
      setItem(prev => ({ ...prev, ...unwrap(res) }))
    } catch {
      // ignore
    } finally {
      setCompleting(false)
    }
  }

  return (
    <AppLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/action-items')} style={{ marginBottom: 24 }}>
        <i className="bi bi-arrow-left" /> 액션 아이템 목록으로
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--sage-50), var(--bg-cream))' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <span className={`quest-level ${CATEGORY_CLASS[item.category] ?? 'ql1'}`}>
            {item.formatName} · {item.estimatedMinutes}분
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

        <h1 className="page-title" style={{ marginBottom: 10 }}>{item.title}</h1>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-person-fill" style={{ color: 'var(--sage-300)' }} /> {item.categoryName}
          </span>
          {item.createdAt && (
            <span style={{ fontSize: 13, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="bi bi-calendar3" /> 생성일 {item.createdAt.slice(0, 10)}
            </span>
          )}
        </div>

        {item.recoveryTypeDescription && (
          <div style={{
            padding: '14px 18px',
            background: 'rgba(110,154,101,0.08)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--sage-300)',
            fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6,
          }}>
            <i className="bi bi-robot" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
            {item.recoveryTypeDescription}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>
            <i className="bi bi-question-circle-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
            이 액션 아이템을 하는 이유
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.7 }}>{item.description}</p>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>
            <i className="bi bi-lightbulb-fill" style={{ color: 'var(--amber-300)', marginRight: 6 }} />
            도움이 되는 팁
          </div>
          <ul style={{ listStyle: 'none' }}>
            {tips.map((tip, i) => (
              <li key={i} style={{
                display: 'flex', gap: 8, alignItems: 'flex-start',
                padding: '6px 0', borderBottom: i < tips.length - 1 ? '1px solid var(--line)' : 'none',
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
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--sage-700)', color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13,
              }}>1</div>
            </div>
            <div style={{ paddingTop: 6, fontSize: 15, color: 'var(--ink-900)', lineHeight: 1.6 }}>
              {item.description}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {done ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-lg" style={{ flex: 1 }} onClick={() => navigate('/action-items')}>목록으로</button>
          {item.questId && (
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => navigate(`/quests/${item.questId}/complete`)}>
              <i className="bi bi-pencil-square" /> 회고 작성하기
            </button>
          )}
        </div>
      ) : skipped ? (
        <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} onClick={() => navigate('/action-items')}>목록으로</button>
      ) : (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost btn-lg" style={{ flex: 1 }} onClick={() => navigate('/action-items')}>
            나중에 하기
          </button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleComplete} disabled={completing}>
            {completing
              ? <span className="spinner" />
              : <><i className="bi bi-check-circle-fill" /> 완료했어요</>
            }
          </button>
        </div>
      )}
    </AppLayout>
  )
}
