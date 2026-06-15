import { QUESTIONS, SCALE_LABELS, RECOVERY_TYPE_INFO, useOnboarding } from '../../hooks/useOnboarding'

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
  const {
    navigate,
    isRetake,
    step,
    setStep,
    answers,
    setAnswer,
    result,
    submitting,
    error,
    answeredCount,
    allAnswered,
    onSubmit,
  } = useOnboarding()

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
