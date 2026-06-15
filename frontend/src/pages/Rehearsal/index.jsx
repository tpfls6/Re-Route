import { AppLayout } from '../../components/layout/AppLayout'
import { useRehearsal } from '../../hooks/useRehearsal'
import { PaginationBar } from '../../components/common/PaginationBar'

export default function Rehearsal() {
  const {
    navigate,
    scenarios,
    selected,
    setSelected,
    messages,
    input,
    setInput,
    loading,
    finished,
    suggestEnd,
    setSuggestEnd,
    completing,
    saving,
    savedResult,
    userTurnCount,
    history,
    historyLoading,
    expandedHistoryIds,
    historyPage,
    setHistoryPage,
    messagesEndRef,
    inputRef,
    historyRefs,
    toggleHistory,
    startScenario,
    handleKeyDown,
    handleSend,
    handleComplete,
    handleSave,
    highlightId,
    totalHistoryPages,
    pagedHistory,
  } = useRehearsal()

  // ── 시나리오 진행 화면 ──
  if (selected) {
    return (
      <AppLayout>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: 20 }}>
          <i className="bi bi-arrow-left" /> 시나리오 목록으로
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 220px)',
          minHeight: 520,
        }}>
          {/* 헤더 */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(240,198,116,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`bi ${selected.icon}`} style={{ color: 'var(--amber-300)', fontSize: 17 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{selected.desc}</div>
            </div>
            {!finished && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  padding: '3px 10px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.45)', fontSize: 12,
                }}>
                  {userTurnCount}턴
                </div>
                <button
                  onClick={handleComplete}
                  disabled={completing || loading || messages.length === 0}
                  style={{
                    padding: '4px 12px', borderRadius: 100, border: 'none', fontSize: 12,
                    background: 'rgba(240,198,116,0.18)', color: 'var(--amber-300)',
                    cursor: messages.length > 0 ? 'pointer' : 'default',
                    fontWeight: 600, transition: 'background 0.15s',
                  }}
                >
                  {completing
                    ? <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5, borderColor: 'rgba(240,198,116,0.3)', borderTopColor: 'var(--amber-300)', display: 'inline-block' }} />
                    : <><i className="bi bi-check2-circle" style={{ marginRight: 4 }} />완료</>
                  }
                </button>
              </div>
            )}
          </div>

          {/* 메시지 */}
          <div className="rehearsal-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: 10,
              }}>
                {msg.role === 'npc' && (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #f0c674, #e08a3c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className={`bi ${selected.icon}`} style={{ color: 'white', fontSize: 14 }} />
                  </div>
                )}
                <div style={{ maxWidth: '72%' }}>
                  {msg.role === 'npc' && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4, paddingLeft: 4 }}>
                      NPC · AI 상대
                    </div>
                  )}
                  <div style={{
                    padding: '10px 15px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'var(--sage-500)' : 'rgba(255,255,255,0.08)',
                    color: 'white', fontSize: 14, lineHeight: 1.6, wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f0c674, #e08a3c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`bi ${selected.icon}`} style={{ color: 'white', fontSize: 14 }} />
                </div>
                <div style={{ padding: '10px 15px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.08)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* 완료 카드 */}
            {finished && (
              <div style={{ marginTop: 8, padding: '18px 20px', borderRadius: 14, background: 'rgba(240,198,116,0.1)', border: '1px solid rgba(240,198,116,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--amber-300)', fontWeight: 700, fontSize: 14 }}>
                  <i className="bi bi-star-fill" /> 리허설 완료
                </div>
                {finished.feedback && (
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.7, margin: '0 0 14px' }}>
                    {finished.feedback}
                  </p>
                )}

                {/* 저장 전 */}
                {!savedResult && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--amber-300)', color: '#1a1a2e', border: 'none', fontWeight: 700 }}
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving
                        ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> 저장 중...</>
                        : <><i className="bi bi-bookmark-check-fill" /> 저장하고 퀘스트 받기</>
                      }
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                      onClick={() => startScenario(selected)}
                    >
                      <i className="bi bi-arrow-clockwise" /> 다시 하기
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                      onClick={() => setSelected(null)}
                    >
                      <i className="bi bi-grid" /> 다른 시나리오
                    </button>
                  </div>
                )}

                {/* 저장 후 */}
                {savedResult && !savedResult.error && (
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 10 }}>
                      {savedResult.quest
                        ? <><i className="bi bi-check-circle-fill" style={{ marginRight: 4, color: '#6fcf97' }} />저장 완료! 퀘스트가 생성됐어요.</>
                        : <><i className="bi bi-exclamation-circle" style={{ marginRight: 4, color: '#f2994a' }} />저장됐지만 퀘스트 생성에 실패했어요. 나중에 다시 시도해보세요.</>
                      }
                    </div>
                    {savedResult.quest && (
                      <div
                        onClick={() => navigate(`/quests/${savedResult.quest.id}`)}
                        style={{
                          padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                          marginBottom: 12, transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <i className="bi bi-trophy-fill" style={{ color: 'var(--amber-300)', fontSize: 14 }} />
                          <span style={{ color: 'var(--amber-300)', fontSize: 11, fontWeight: 700 }}>
                            {savedResult.quest.recoveryTypeName} · Level {savedResult.quest.difficulty}
                          </span>
                          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                            {savedResult.quest.estimatedMinutes}분
                          </span>
                        </div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                          {savedResult.quest.title}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                          탭하여 퀘스트 상세 보기 →
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                        onClick={() => startScenario(selected)}
                      >
                        <i className="bi bi-arrow-clockwise" /> 다시 하기
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                        onClick={() => setSelected(null)}
                      >
                        <i className="bi bi-grid" /> 다른 시나리오
                      </button>
                    </div>
                  </div>
                )}

                {savedResult?.error && (
                  <div style={{ color: '#ff8080', fontSize: 13, marginBottom: 10 }}>
                    저장에 실패했어요. 다시 시도해주세요.
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* suggestEnd 배너 */}
          {suggestEnd && !finished && (
            <div style={{
              margin: '0 16px 12px',
              padding: '12px 16px',
              background: 'rgba(240,198,116,0.1)',
              borderRadius: 12,
              border: '1px solid rgba(240,198,116,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                <i className="bi bi-stars" style={{ marginRight: 6, color: 'var(--amber-300)' }} />
                AI가 리허설 마무리를 제안하고 있어요
              </span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => setSuggestEnd(false)}
                  disabled={completing}
                  style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}
                >
                  계속하기
                </button>
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--amber-300)', color: '#1a1a2e', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  {completing ? '마무리 중...' : '마무리하기'}
                </button>
              </div>
            </div>
          )}

          {/* 입력창 */}
          {!finished && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                rows={1}
                className="rehearsal-input"
                placeholder="답변을 입력하세요... (Shift+Enter로 줄바꿈)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1, resize: 'none',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '10px 14px', color: 'white', fontSize: 14,
                  outline: 'none', maxHeight: 100, overflowY: 'auto',
                  scrollbarWidth: 'none', msOverflowStyle: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0,
                  background: input.trim() && !loading ? 'var(--amber-300)' : 'rgba(255,255,255,0.08)',
                  color: input.trim() && !loading ? '#1a1a2e' : 'rgba(255,255,255,0.3)',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <i className="bi bi-send-fill" style={{ fontSize: 14 }} />
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
          }
          .rehearsal-messages::-webkit-scrollbar { display: none; }
          .rehearsal-messages { scrollbar-width: none; -ms-overflow-style: none; }
          .rehearsal-input::-webkit-scrollbar { display: none; }
        `}</style>
      </AppLayout>
    )
  }

  // ── 시나리오 목록 + 히스토리 ──
  return (
    <AppLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">VR 마인드 리허설</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          두려운 상황을 안전한 공간에서 AI 상대와 미리 연습합니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20, background: 'var(--ink-900)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-sm)',
            background: 'rgba(240,198,116,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-robot" style={{ color: 'var(--amber-300)', fontSize: 22 }} />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 2 }}>AI가 실제처럼 반응합니다</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              내 답변에 따라 대화가 달라집니다. 완료 후 저장하면 맞춤 퀘스트도 받을 수 있어요.
            </div>
          </div>
        </div>
      </div>

      <div className="scenario-grid" style={{ marginBottom: 40 }}>
        {scenarios.map(s => (
          <div key={s.id} className="scenario-card">
            <div className="scenario-icon">
              <i className={`bi ${s.icon}`} style={{ fontSize: 40, color: 'var(--sage-500)' }} />
            </div>
            <div className="scenario-name">{s.name}</div>
            <div className="scenario-desc">{s.desc}</div>
            <span className={`scenario-difficulty quest-level ${s.diffClass}`}>{s.diffLabel}</span>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => startScenario(s)}>
                <i className="bi bi-play-fill" /> 시작하기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 지난 리허설 히스토리 */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--ink-900)' }}>
          <i className="bi bi-clock-history" style={{ marginRight: 8, color: 'var(--sage-500)' }} />
          지난 리허설
        </h2>

        {historyLoading && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-400)' }}>
            <span className="spinner" style={{ width: 20, height: 20, display: 'inline-block' }} />
          </div>
        )}

        {!historyLoading && history.length === 0 && (
          <div className="empty-state">
            <div className="empty-title" style={{ fontSize: 14 }}>아직 저장된 리허설이 없어요</div>
            <div style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 4 }}>
              리허설 완료 후 "저장하고 퀘스트 받기"를 눌러보세요
            </div>
          </div>
        )}

        {!historyLoading && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pagedHistory.map(h => {
                const scenario = scenarios.find(s => s.id === h.scenarioId)
                const isExpanded = expandedHistoryIds.has(h.id)
                const isHighlighted = h.id === highlightId
                return (
                  <div
                    key={h.id}
                    ref={el => { if (el) historyRefs.current[h.id] = el }}
                    style={{
                      background: 'var(--white)', borderRadius: 'var(--radius-md)',
                      padding: '18px 22px',
                      border: isHighlighted ? '2px solid var(--amber-300)' : '1px solid var(--line)',
                      boxShadow: isHighlighted ? '0 0 0 3px rgba(240,198,116,0.15)' : 'none',
                      transition: 'box-shadow 0.3s',
                    }}
                  >
                    {/* 헤더 행 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, #f0c674, #e08a3c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <i className={`bi ${scenario?.icon ?? 'bi-play'}`} style={{ color: 'white', fontSize: 14 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-900)' }}>{h.scenarioName}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>{h.createdAt?.slice(0, 10)}</div>
                      </div>
                      {h.questId && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 12 }}
                          onClick={() => navigate(`/quests/${h.questId}`)}
                        >
                          퀘스트 보기 <i className="bi bi-arrow-right" />
                        </button>
                      )}
                    </div>

                    {/* 피드백 */}
                    {h.feedback && (
                      <div style={{
                        padding: '10px 14px', borderRadius: 10,
                        background: 'var(--bg-soft)', fontSize: 13,
                        color: 'var(--ink-600)', lineHeight: 1.6, marginBottom: 10,
                      }}>
                        <i className="bi bi-chat-quote" style={{ marginRight: 6, color: 'var(--sage-500)' }} />
                        {h.feedback}
                      </div>
                    )}

                    {/* 대화 내용 보기 토글 */}
                    {h.messages?.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleHistory(h.id)}
                          style={{
                            fontSize: 12, color: 'var(--sage-500)', background: 'none',
                            border: 'none', padding: 0, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}
                        >
                          <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} />
                          {isExpanded ? '대화 숨기기' : `대화 보기 (${h.messages.length}개 메시지)`}
                        </button>
                        {isExpanded && (
                          <div style={{
                            marginTop: 10, padding: '16px', borderRadius: 10,
                            background: '#1a1a2e',
                            display: 'flex', flexDirection: 'column', gap: 10,
                            maxHeight: 380, overflowY: 'auto',
                          }}>
                            {h.messages.map((msg, i) => {
                              const isUser = msg.role === 'user'
                              return (
                                <div key={i} style={{
                                  display: 'flex',
                                  flexDirection: isUser ? 'row-reverse' : 'row',
                                  alignItems: 'flex-end', gap: 8,
                                }}>
                                  {!isUser && (
                                    <div style={{
                                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                      background: 'linear-gradient(135deg, #f0c674, #e08a3c)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                      <i className={`bi ${scenario?.icon ?? 'bi-robot'}`} style={{ color: 'white', fontSize: 11 }} />
                                    </div>
                                  )}
                                  <div style={{
                                    maxWidth: '72%',
                                    padding: '8px 12px',
                                    borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    background: isUser ? 'var(--sage-500)' : 'rgba(255,255,255,0.08)',
                                    color: 'white', fontSize: 13, lineHeight: 1.6, wordBreak: 'break-word',
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
                  </div>
                )
              })}
            </div>

            <PaginationBar
              page={historyPage}
              totalPages={totalHistoryPages}
              onChange={setHistoryPage}
            />
          </>
        )}
      </div>
    </AppLayout>
  )
}
