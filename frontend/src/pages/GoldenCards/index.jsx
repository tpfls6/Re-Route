import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { get_counseling_analysis } from '../../api/counselingApi'
import { useGoldenCards } from '../../hooks/useGoldenCards'

const unwrap = (res) => res.data?.data ?? res.data

const FEELING_MAP = {
  proud:  { icon: 'bi-star-fill',    label: '뿌듯해요',   color: 'var(--amber-500)' },
  okay:   { icon: 'bi-emoji-smile',  label: '괜찮았어요', color: 'var(--sage-500)' },
  hard:   { icon: 'bi-emoji-frown',  label: '힘들었어요', color: 'var(--terra-500)' },
  mixed:  { icon: 'bi-clouds',       label: '복잡했어요', color: '#8e5a8e' },
}

const RECOVERY_COLOR = {
  AVOIDANT:         { color: 'var(--terra-500)', bg: '#ffe8dc' },
  OVERFOCUSED:      { color: 'var(--amber-500)', bg: '#f4e5d0' },
  LETHARGIC:        { color: 'var(--sage-700)',  bg: 'var(--sage-50)' },
  RELATION_ANXIOUS: { color: '#5a6b85',          bg: '#e5e8f0' },
  PERFECTIONIST:    { color: '#8e5a8e',          bg: '#f0e5f0' },
}

const hasRetrospective = quest =>
  Boolean(
    quest.feeling
    || quest.difficultyRating
    || quest.reflection?.trim()
    || quest.nextStep?.trim()
  )

function StarRow({ value }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <i
          key={n}
          className="bi bi-star-fill"
          style={{ fontSize: 12, color: n <= value ? 'var(--amber-500)' : 'var(--line)' }}
        />
      ))}
    </div>
  )
}

function GoldenCardItem({ quest, onClick }) {
  const feeling = FEELING_MAP[quest.feeling]
  const typeStyle = RECOVERY_COLOR[quest.recoveryType] ?? { color: 'var(--ink-500)', bg: 'var(--line)' }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'linear-gradient(145deg, #fffbf0, #fef3c7)',
        border: '1.5px solid #f0d06a',
        borderRadius: 16,
        padding: '20px 22px',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 2px 8px rgba(200,160,40,0.10)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,160,40,0.20)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(200,160,40,0.10)'
      }}
    >
      {/* Gold shimmer accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: 'radial-gradient(circle at top right, rgba(240,190,50,0.18), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f4d060, #e09820)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(200,140,20,0.30)',
        }}>
          <i className="bi bi-star-fill" style={{ color: 'white', fontSize: 15 }} />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
          background: typeStyle.bg, color: typeStyle.color,
        }}>
          {quest.recoveryTypeName}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 15, fontWeight: 700, color: '#3a2810',
        lineHeight: 1.4, marginBottom: 10,
      }}>
        {quest.title}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: '#7a5a20', display: 'flex', alignItems: 'center', gap: 3 }}>
          <i className="bi bi-clock" /> {quest.estimatedMinutes}분
        </span>
        <span style={{ fontSize: 12, color: '#7a5a20', display: 'flex', alignItems: 'center', gap: 3 }}>
          <i className="bi bi-calendar3" /> {quest.createdAt?.slice(0, 10)}
        </span>
      </div>

      {/* Retrospective preview */}
      {hasRetrospective(quest) ? (
        <div style={{
          paddingTop: 12, borderTop: '1px solid rgba(200,160,40,0.25)',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {(feeling || quest.difficultyRating > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {feeling && (
                <>
                  <i className={`bi ${feeling.icon}`} style={{ fontSize: 14, color: feeling.color }} />
                  <span style={{ fontSize: 12, color: '#5a4020', fontWeight: 600 }}>{feeling.label}</span>
                </>
              )}
              {quest.difficultyRating > 0 && <StarRow value={quest.difficultyRating} />}
            </div>
          )}
          {quest.reflection && (
            <div style={{
              fontSize: 12, color: '#6a5030', lineHeight: 1.5,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {quest.reflection}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          paddingTop: 12, borderTop: '1px solid rgba(200,160,40,0.25)',
        }}>
          <span style={{ fontSize: 12, color: '#a0855a' }}>
            회고가 아직 작성되지 않았어요
          </span>
        </div>
      )}
    </div>
  )
}

function RetrospectiveModal({ quest, onClose }) {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const feeling = FEELING_MAP[quest.feeling]
  const typeStyle = RECOVERY_COLOR[quest.recoveryType] ?? {}

  useEffect(() => {
    if (!quest.sessionId) return
    get_counseling_analysis(quest.sessionId)
      .then(res => setAnalysis(unwrap(res)))
      .catch(() => {})
  }, [quest.sessionId])

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 20,
          width: '100%', maxWidth: 600,
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
          padding: '32px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f4d060, #e09820)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(200,140,20,0.30)',
              flexShrink: 0,
            }}>
              <i className="bi bi-star-fill" style={{ color: 'white', fontSize: 20 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-400)', marginBottom: 3 }}>황금 카드</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink-900)', lineHeight: 1.3 }}>
                {quest.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--ink-400)', flexShrink: 0 }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100,
            background: typeStyle.bg, color: typeStyle.color,
          }}>{quest.recoveryTypeName}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-500)', padding: '4px 10px', background: 'var(--sage-50)', borderRadius: 100 }}>
            <i className="bi bi-clock" style={{ marginRight: 4 }} />{quest.estimatedMinutes}분
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-500)', padding: '4px 10px', background: 'var(--sage-50)', borderRadius: 100 }}>
            <i className="bi bi-calendar3" style={{ marginRight: 4 }} />{quest.createdAt?.slice(0, 10)}
          </span>
        </div>

        {/* Quest context (background/why) */}
        {(quest.background || quest.why) && (
          <div style={{
            background: 'var(--sage-50)', borderLeft: '3px solid var(--sage-300)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sage-700)', marginBottom: 6 }}>
              <i className="bi bi-robot" style={{ marginRight: 5 }} />AI 상담 기반 배경
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.6, margin: 0 }}>
              {quest.background ?? quest.why}
            </p>
          </div>
        )}

        {/* Counseling Analysis */}
        {analysis && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-activity" style={{ color: 'var(--sage-500)' }} />
              당시 상담 분석
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="struct-box">
                <div className="struct-key">상담 요약</div>
                <div className="struct-val">{analysis.summary}</div>
              </div>
              {analysis.emotionKeywords?.length > 0 && (
                <div className="struct-box">
                  <div className="struct-key">감정 키워드</div>
                  <div className="struct-val">{analysis.emotionKeywords.join(', ')}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Retrospective */}
        {hasRetrospective(quest) ? (
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20 }}>
            <div style={{
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="bi bi-journal-text" style={{ color: 'var(--amber-500)' }} />
                나의 회고
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(`/quests/${quest.id}/complete`)}
              >
                <i className="bi bi-pencil-square" /> 회고 수정
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {feeling && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={`bi ${feeling.icon}`} style={{ fontSize: 18, color: feeling.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>{feeling.label}</span>
                  </div>
                )}
                {quest.difficultyRating > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>난이도</span>
                    <StarRow value={quest.difficultyRating} />
                  </div>
                )}
              </div>
              {quest.reflection && (
                <div style={{
                  background: '#fffdf5', border: '1px solid #f0e8c0',
                  borderRadius: 10, padding: '14px 16px',
                  fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.7,
                }}>
                  {quest.reflection}
                </div>
              )}
              {quest.nextStep && (
                <div style={{
                  background: 'var(--sage-50)', border: '1px solid var(--sage-100)',
                  borderRadius: 10, padding: '12px 16px',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sage-700)', marginBottom: 5 }}>
                    <i className="bi bi-arrow-right-circle-fill" style={{ marginRight: 5 }} />다음 단계
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.6 }}>{quest.nextStep}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            borderTop: '1px solid var(--line)', paddingTop: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
          }}>
            <i className="bi bi-journal-text" style={{ fontSize: 28, color: 'var(--ink-300)' }} />
            <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: 0 }}>아직 회고가 작성되지 않았어요.</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/quests/${quest.id}/complete`)}
            >
              회고 작성하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GoldenCards() {
  const navigate = useNavigate()
  const { quests, loading, selected, setSelected, error } = useGoldenCards()

  return (
    <AppLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="bi bi-star-fill" style={{ color: 'var(--amber-500)', fontSize: 24 }} />
          황금 카드
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          완료한 퀘스트와 그때의 회고를 돌아보세요.
        </p>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-400)' }}>
          <span className="spinner" /> 불러오는 중...
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error">{error}</div>
      )}

      {!loading && !error && quests.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <i className="bi bi-star" style={{ fontSize: 40, color: 'var(--line)', display: 'block', marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-700)', marginBottom: 8 }}>
            아직 획득한 황금 카드가 없어요
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 0 }}>
            AI 상담 후 퀘스트를 완료하면 황금 카드가 쌓입니다.
          </p>
        </div>
      )}

      {!error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {quests.map(q => (
            <GoldenCardItem
              key={q.id}
              quest={q}
              onClick={() => setSelected(q)}
            />
          ))}
        </div>
      )}

      {selected && (
        <RetrospectiveModal quest={selected} onClose={() => setSelected(null)} />
      )}
    </AppLayout>
  )
}
