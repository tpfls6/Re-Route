import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { post_onboarding } from '../../api/userApi'
import { useAuth } from '../../hooks/useAuth'

const QUESTIONS = [
  '해야 할 일이 생기면 자꾸 미루게 되는 편인가요?',
  '한 가지 걱정이 머릿속에서 계속 맴돌 때가 많나요?',
  '뭔가 시작하는 것 자체가 특히 힘들게 느껴지나요?',
  '상대방의 반응이나 답장이 많이 신경 쓰이나요?',
  '실수할까봐 행동을 주저할 때가 많나요?',
  '불편한 감정이나 상황을 피하려는 경향이 있나요?',
  '특정 관계나 목표에 지나치게 집착하게 되는 편인가요?',
  '에너지나 의욕이 없어서 일상이 잘 안 돌아갈 때가 있나요?',
  '거절당하거나 무시당할까봐 두려울 때가 있나요?',
  '완벽하게 못 할 것 같아서 시작을 못 하는 경우가 있나요?',
]

const SCALE_LABELS = ['전혀 아니다', '아니다', '보통', '그렇다', '매우 그렇다']

const RECOVERY_TYPE_INFO = {
  AVOIDANT: { label: '회피형', desc: '감정이나 문제를 마주하기보다 미루거나 피하는 경향이 있어요.', strategy: '단계적 노출', color: 'var(--terra-500)', bg: '#ffe8dc' },
  OVERFOCUSED: { label: '과몰입형', desc: '특정 고민, 관계, 목표에 지나치게 몰두하고 끊어내기 어려운 경향이 있어요.', strategy: '리프레이밍', color: 'var(--amber-500)', bg: '#f4e5d0' },
  LETHARGIC: { label: '무기력형', desc: '에너지와 동기가 낮아 시작 자체가 어려운 경향이 있어요.', strategy: '1분 과제', color: 'var(--sage-700)', bg: 'var(--sage-50)' },
  RELATION_ANXIOUS: { label: '관계불안형', desc: '타인의 반응, 거절, 거리감, 인정 욕구에 민감한 경향이 있어요.', strategy: '대화 훈련', color: '#5a6b85', bg: '#e5e8f0' },
  PERFECTIONIST: { label: '완벽주의형', desc: '높은 기준과 실패에 대한 두려움 때문에 실행이 막히는 경향이 있어요.', strategy: '실패 연습', color: '#8e5a8e', bg: '#f0e5f0' },
}

function ProgressBar({ answered, total }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>질문에 답해주세요</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--sage-700)' }}>{answered} / {total}</span>
      </div>
      <div style={{ height: 4, background: 'var(--line)', borderRadius: 2 }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'var(--sage-500)',
          width: `${(answered / total) * 100}%`,
          transition: 'width 0.3s',
        }} />
      </div>
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { updateUser } = useAuth()
  const isRetake = searchParams.get('retake') === 'true'

  const [step, setStep] = useState(isRetake ? 2 : 1)
  const [answers, setAnswers] = useState(Array(10).fill(null))
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const answeredCount = answers.filter(a => a !== null).length
  const allAnswered = answeredCount === 10

  function setAnswer(index, value) {
    setAnswers(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  async function onSubmit() {
    if (!allAnswered) return
    setSubmitting(true)
    setError('')
    try {
      const res = await post_onboarding(answers)
      const data = res.data?.data ?? res.data
      setResult(data.primaryRecoveryType)
      updateUser({
        primaryRecoveryType: data.primaryRecoveryType,
        primaryRecoveryTypeName: data.primaryRecoveryTypeName,
        onboardingCompleted: true,
      })
      setStep(3)
    } catch {
      setError('잠시 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 1) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div className="logo-mark" style={{ width: 60, height: 60, fontSize: 28, borderRadius: 18 }}>R</div>
          </div>
          <h1 className="onboarding-title">처음 오셨군요,<br />환영합니다</h1>
          <p className="onboarding-desc">
            Re-Route는 AI와의 대화를 통해 감정을 구조화하고,<br />
            작은 행동 퀘스트로 삶을 조금씩 바꿔가는 여정입니다.
          </p>
          <p className="onboarding-desc" style={{ color: 'var(--sage-700)', fontWeight: 600 }}>
            10개의 질문으로 나의 회복 유형을 확인해봐요.
          </p>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(2)}>
            시작하기 <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card" style={{ maxWidth: 600 }}>
          {isRetake && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/my')}>
                <i className="bi bi-arrow-left" /> 마이페이지로
              </button>
            </div>
          )}
          <h2 className="onboarding-title" style={{ fontSize: 22 }}>
            {isRetake ? '회복 유형 재검사' : '나의 회복 유형 찾기'}
          </h2>
          <p className="onboarding-desc" style={{ marginBottom: 20 }}>
            각 질문에 솔직하게 응답해주세요. 1점(전혀 아니다) ~ 5점(매우 그렇다)
          </p>

          <ProgressBar answered={answeredCount} total={10} />

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {QUESTIONS.map((question, i) => (
              <div key={i} style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${answers[i] !== null ? 'var(--sage-300)' : 'var(--line)'}`,
                background: answers[i] !== null ? 'var(--sage-50)' : 'var(--bg)',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 14, lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--sage-500)', fontWeight: 700, marginRight: 6 }}>Q{i + 1}.</span>
                  {question}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => setAnswer(i, v)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${answers[i] === v ? 'var(--sage-500)' : 'var(--line)'}`,
                        background: answers[i] === v ? 'var(--sage-500)' : 'var(--white)',
                        color: answers[i] === v ? 'var(--white)' : 'var(--ink-500)',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>{SCALE_LABELS[0]}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>{SCALE_LABELS[4]}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 24 }}
            disabled={!allAnswered || submitting}
            onClick={onSubmit}
          >
            {submitting ? '분석 중...' : '결과 확인하기'} <i className="bi bi-arrow-right" />
          </button>

          {!isRetake && (
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep(1)}>
              이전으로
            </button>
          )}
        </div>
      </div>
    )
  }

  const typeInfo = RECOVERY_TYPE_INFO[result] ?? {}
  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
            background: typeInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            <i className="bi bi-person-fill" style={{ color: typeInfo.color }} />
          </div>
          <h2 className="onboarding-title" style={{ marginBottom: 8 }}>
            {isRetake ? '재검사 완료!' : '유형이 확인됐어요!'}
          </h2>
        </div>

        <div style={{
          background: typeInfo.bg, borderRadius: 'var(--radius-md)', padding: '20px',
          textAlign: 'center', marginBottom: 24,
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: typeInfo.color, marginBottom: 8 }}>
            {typeInfo.label}
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.6 }}>
            {typeInfo.desc}
          </div>
          <div style={{
            marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 100,
            background: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, color: typeInfo.color,
          }}>
            <i className="bi bi-lightbulb" /> 추천 전략: {typeInfo.strategy}
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--ink-500)', textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
          이 유형은 현재 경향을 참고하는 것으로, 고정된 특성이 아니에요.<br />
          언제든지 마이페이지에서 재검사할 수 있습니다.
        </p>

        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginBottom: 10 }}
          onClick={() => navigate(isRetake ? '/my' : '/dashboard')}
        >
          {isRetake ? '마이페이지로' : '대시보드로 이동'} <i className="bi bi-arrow-right" />
        </button>
        {!isRetake && (
          <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} onClick={() => navigate('/counseling')}>
            <i className="bi bi-robot" /> AI 상담 시작하기
          </button>
        )}
      </div>
    </div>
  )
}
