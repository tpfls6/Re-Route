import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useAnalysisDetail } from '../../hooks/useAnalysisDetail'

const DIFFICULTY_CLASS = { 1: 'ql1', 2: 'ql2', 3: 'ql3' }

export default function AnalysisDetail() {
  const navigate = useNavigate()
  const {
    analysis,
    loading,
    error,
    messages,
    msgLoading,
    showMessages,
    handleToggleMessages,
  } = useAnalysisDetail()

  return (
    <AppLayout>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/counseling')}>
          <i className="bi bi-arrow-left" /> 상담 목록
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleToggleMessages}>
          <i className={`bi ${showMessages ? 'bi-chevron-up' : 'bi-chat-left-text'}`} style={{ marginRight: 4 }} />
          {showMessages ? '대화 닫기' : '상담 보기'}
        </button>
      </div>

      {/* 상담 대화 내역 */}
      {showMessages && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>
            <i className="bi bi-chat-left-text" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
            상담 대화 기록
          </div>
          {msgLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-400)', fontSize: 13 }}>
              <span className="spinner" /> 불러오는 중...
            </div>
          ) : (messages?.length ?? 0) === 0 ? (
            <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>대화 기록이 없습니다.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 480, overflowY: 'auto' }}>
              {messages.map((msg, i) => {
                const isUser = msg.role === 'USER' || msg.role === 'user'
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isUser ? 'var(--sage-700)' : 'var(--bg-cream)',
                      color: isUser ? 'white' : 'var(--ink-900)',
                      border: isUser ? 'none' : '1px solid var(--line)',
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <span className="badge">
          <i className="bi bi-chat-heart" /> Gemini 상담 분석 리포트
        </span>
        <h1 className="page-title" style={{ marginTop: 10 }}>상담 분석 결과</h1>
      </div>

      {loading && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="spinner" />
          <span>분석 결과를 불러오는 중입니다...</span>
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ color: 'var(--coral-500)' }}>{error}</div>
      )}

      {!loading && analysis && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <i className="bi bi-activity" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
                  회복 유형
                </span>
              </div>
              <div className="struct-box" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-100)' }}>
                <div className="struct-key">{analysis.recoveryType}</div>
                <div className="struct-val" style={{ fontSize: 20, fontWeight: 700 }}>
                  {analysis.recoveryTypeName}
                </div>
              </div>
              <div className="struct-box">
                <div className="struct-key">분석 신뢰도</div>
                <div className="struct-val">
                  {Math.round((analysis.confidence ?? 0) * 100)}%
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <i className="bi bi-heart" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
                  감정 키워드
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {analysis.emotionKeywords?.map(keyword => (
                  <span className="badge" key={keyword}>{keyword}</span>
                ))}
                {!analysis.emotionKeywords?.length && (
                  <span style={{ color: 'var(--ink-500)', fontSize: 13 }}>관찰된 키워드가 없습니다.</span>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--sage-300)' }}>
            <div className="card-header">
              <span className="card-title">AI 분석 요약</span>
            </div>
            <div style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>{analysis.summary}</div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">분류 이유</span>
            </div>
            <div style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>{analysis.reason}</div>
          </div>

          {/* Action Items */}
          {analysis.recommendedActionItems?.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-title" style={{ marginBottom: 16 }}>
                <i className="bi bi-check2-square" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
                추천 액션 아이템
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {analysis.recommendedActionItems.map(item => (
                  <div key={item.id} style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: 'var(--bg-cream)',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)', marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, marginBottom: 8 }}>
                      {item.description}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="badge">{item.categoryName}</span>
                      <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>
                        <i className="bi bi-clock" style={{ marginRight: 3 }} />{item.estimatedMinutes}분
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Quest */}
          {analysis.generatedQuest && (
            <div
              className="card"
              onClick={() => navigate(`/quests/${analysis.generatedQuest.id}`)}
              style={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--sage-50), var(--bg-cream))',
                border: '1px solid var(--sage-100)',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="card-title" style={{ marginBottom: 0 }}>
                  <i className="bi bi-lightning-charge-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
                  이번 상담의 추천 퀘스트
                </div>
                <i className="bi bi-arrow-right" style={{ color: 'var(--sage-500)', fontSize: 16 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink-900)', marginBottom: 6 }}>
                    {analysis.generatedQuest.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, marginBottom: 10 }}>
                    {analysis.generatedQuest.background}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className={`quest-level ${DIFFICULTY_CLASS[analysis.generatedQuest.difficulty] ?? 'ql1'}`}>
                      {analysis.generatedQuest.difficultyLabel}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <i className="bi bi-clock" />{analysis.generatedQuest.estimatedMinutes}분
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--sage-600)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <i className="bi bi-person-fill" />{analysis.generatedQuest.recoveryTypeName}
                    </span>
                  </div>
                </div>
                <div style={{
                  flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--sage-700)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>🌿</div>
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  )
}
