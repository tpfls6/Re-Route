import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { get_quest_detail, complete_quest, save_retrospective } from '../../api/questApi'

const FEELING_OPTIONS = [
  { id: 'proud', icon: 'bi-star-fill', label: '뿌듯해요', color: 'var(--amber-500)' },
  { id: 'okay', icon: 'bi-emoji-smile', label: '괜찮았어요', color: 'var(--sage-500)' },
  { id: 'hard', icon: 'bi-emoji-frown', label: '힘들었어요', color: 'var(--terra-500)' },
  { id: 'mixed', icon: 'bi-clouds', label: '복잡했어요', color: '#8e5a8e' },
]

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 28,
            color: n <= value ? 'var(--amber-500)' : 'var(--line)',
            transition: 'color 0.15s, transform 0.1s',
            padding: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <i className="bi bi-star-fill" />
        </button>
      ))}
    </div>
  )
}

const unwrap = (res) => res.data?.data ?? res.data

export default function QuestComplete() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quest, setQuest] = useState(null)
  const [questLoading, setQuestLoading] = useState(true)
  const [feeling, setFeeling] = useState(null)
  const [difficulty, setDifficulty] = useState(0)
  const [reflection, setReflection] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    get_quest_detail(id)
      .then(res => {
        if (!mounted) return
        const nextQuest = unwrap(res)
        setQuest(nextQuest)
        setFeeling(nextQuest?.feeling ?? null)
        setDifficulty(nextQuest?.difficultyRating ?? 0)
        setReflection(nextQuest?.reflection ?? '')
        setNextStep(nextQuest?.nextStep ?? '')
      })
      .catch(err => {
        if (mounted) setError(err.response?.data?.message ?? '퀘스트를 불러오지 못했습니다.')
      })
      .finally(() => { if (mounted) setQuestLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      if (quest?.status !== 'COMPLETED') {
        await complete_quest(id)
      }
      await save_retrospective(id, {
        feeling: feeling ?? null,
        difficultyRating: difficulty > 0 ? difficulty : null,
        reflection: reflection.trim() || null,
        nextStep: nextStep.trim() || null,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message ?? '회고를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <AppLayout>
        <div style={{
          maxWidth: 520, margin: '40px auto',
          textAlign: 'center', padding: '48px 32px',
          background: 'var(--white)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink-900)', marginBottom: 12 }}>
            퀘스트 완료!
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ink-500)', lineHeight: 1.6, marginBottom: 28 }}>
            회고까지 작성해주셔서 감사해요.<br />
            오늘의 작은 발걸음이 변화를 만들어요.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            padding: '20px 28px', marginBottom: 28,
            background: 'linear-gradient(135deg, #f4d88a, #e8b860)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <i className="bi bi-star-fill" style={{ fontSize: 28, color: '#5a4220' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#3a2810' }}>황금 카드 획득!</div>
              <div style={{ fontSize: 13, color: '#5a4220', opacity: 0.8 }}>{quest?.title ?? '퀘스트'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/golden-cards')}>
              <i className="bi bi-star-fill" /> 황금 카드 보기
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/action-items')}>
              <i className="bi bi-list-check" /> 퀘스트 목록으로
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/quests/${id}`)} style={{ marginBottom: 24 }}>
        <i className="bi bi-arrow-left" /> 퀘스트로 돌아가기
      </button>

      {/* Celebration Header */}
      <div style={{
        padding: '32px 36px', marginBottom: 24,
        background: 'linear-gradient(135deg, var(--sage-700), var(--sage-500))',
        borderRadius: 'var(--radius-xl)', color: 'var(--white)',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ fontSize: 52 }}>🌿</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>퀘스트 완료</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
            {questLoading ? '불러오는 중...' : (quest?.title ?? '퀘스트')}
          </h1>
          {quest && (
            <span style={{ fontSize: 13, opacity: 0.75, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="bi bi-clock" /> {quest.estimatedMinutes}분 · {quest.difficultyLabel}
            </span>
          )}
        </div>
      </div>

      {/* Reflection Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && <div className="alert alert-error">{error}</div>}

        {/* Feeling */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>
            <i className="bi bi-heart" style={{ color: 'var(--terra-300)', marginRight: 6 }} />
            퀘스트를 하면서 어떤 기분이었나요?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {FEELING_OPTIONS.map(f => (
              <button
                key={f.id}
                onClick={() => setFeeling(f.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '16px 8px', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${feeling === f.id ? f.color : 'var(--line)'}`,
                  background: feeling === f.id ? `${f.color}15` : 'var(--white)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <i className={`bi ${f.icon}`} style={{ fontSize: 24, color: f.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)' }}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>
            <i className="bi bi-bar-chart-fill" style={{ color: 'var(--amber-300)', marginRight: 6 }} />
            어느 정도 어려웠나요?
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <StarRating value={difficulty} onChange={setDifficulty} />
            <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>
              {difficulty === 0 ? '별점을 선택해주세요' :
               difficulty <= 2 ? '쉬웠어요' :
               difficulty === 3 ? '적당했어요' :
               '어려웠어요'}
            </span>
          </div>
        </div>

        {/* Reflection */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>
            <i className="bi bi-journal-text" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
            오늘 퀘스트를 하면서 느낀 점 (선택)
          </div>
          <textarea
            className="form-input"
            style={{ borderRadius: 'var(--radius-md)', resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
            placeholder="어떤 점이 달라졌나요? 어떤 감정이 들었나요? 자유롭게 적어주세요."
            value={reflection}
            onChange={e => setReflection(e.target.value)}
          />
        </div>

        {/* Next Step */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>
            <i className="bi bi-arrow-right-circle-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
            다음엔 어떻게 더 해보고 싶나요? (선택)
          </div>
          <textarea
            className="form-input"
            style={{ borderRadius: 'var(--radius-md)', resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
            placeholder="다음 단계로 도전하고 싶은 것을 적어보세요."
            value={nextStep}
            onChange={e => setNextStep(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={submitting || questLoading || !quest}
          style={{ width: '100%' }}
        >
          {submitting
            ? <><span className="spinner" /> 처리 중...</>
            : <><i className="bi bi-check-circle-fill" /> 회고 완료하기</>
          }
        </button>
      </div>
    </AppLayout>
  )
}
