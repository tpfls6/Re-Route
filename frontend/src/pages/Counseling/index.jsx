import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useModal } from '../../components/common/Modal'
import { useCounseling } from '../../hooks/useCounseling'

export default function Counseling() {
  const navigate = useNavigate()
  const { confirm, ModalElement } = useModal()
  const {
    sessions,
    activeSession,
    messages,
    analysis,
    loading,
    sending,
    error,
    notice,
    suggestClose,
    riskLevel,
    fetchSessions,
    startSession,
    selectSession,
    sendMessage,
    completeSession,
    deleteSession,
    dismissSuggestClose,
  } = useCounseling()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    const newHeight = Math.min(ta.scrollHeight, 160)
    ta.style.height = newHeight + 'px'
    ta.style.overflowY = ta.scrollHeight > 160 ? 'scroll' : 'hidden'
  }, [input])

  useEffect(() => {
    let mounted = true
    fetchSessions().then(nextSessions => {
      if (mounted && nextSessions.length > 0) {
        selectSession(nextSessions[0])
      }
    })
    return () => { mounted = false }
  }, [fetchSessions, selectSession])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSelectSession(s) {
    selectSession(s)
  }

  async function handleNewSession() {
    const title = `새 상담 ${sessions.length + 1}`
    await startSession(title)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    textareaRef.current?.focus()
    try {
      await sendMessage(text)
    } catch {
      setInput(text)
    }
  }

  async function handleComplete() {
    if (!activeSession || messages.length === 0 || loading) return
    dismissSuggestClose()
    await completeSession()
  }

  async function handleDelete(s, e) {
    e.stopPropagation()
    const ok = await confirm({
      icon: 'bi-chat-x-fill',
      title: '상담 삭제',
      message: `"${s.title}" 상담을 삭제하시겠습니까?\n관련된 퀘스트와 액션 아이템도 함께 삭제됩니다.`,
      confirmLabel: '삭제',
      danger: true,
    })
    if (!ok) return
    await deleteSession(s.id)
  }

  const visibleMessages = messages.length > 0
    ? messages
    : [{
      id: 'welcome',
      role: 'ai',
      content: '안녕하세요. 오늘은 어떤 일이 있으셨나요?',
      createdAt: new Date().toISOString(),
    }]

  return (
    <AppLayout>
      {ModalElement}
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">AI 상담</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          AI가 대화를 통해 감정을 구조화하고 행동 과제를 제안합니다.
        </p>
      </div>

      <div className="counseling-layout">
        {/* Session Sidebar */}
        <div className="session-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">
              <i className="bi bi-chat-left-dots" style={{ marginRight: 6, color: 'var(--sage-500)' }} />
              상담 내역
            </span>
            <button className="btn btn-primary btn-sm" onClick={handleNewSession} disabled={loading}>
              <i className="bi bi-plus" />
            </button>
          </div>
          <div className="session-list">
            {sessions.length === 0 && (
              <div className="session-list-item active">
                <div className="session-list-title">새 상담 준비됨</div>
                <div className="session-list-date">첫 메시지를 보내면 시작됩니다</div>
              </div>
            )}
            {sessions.map(s => (
              <div
                key={s.id}
                className={`session-list-item${activeSession?.id === s.id ? ' active' : ''}`}
                onClick={() => handleSelectSession(s)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="session-list-title">{s.title}</div>
                  <div className="session-list-date">{s.createdAt}</div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ flexShrink: 0, padding: '2px 6px', color: 'var(--ink-400)', fontSize: 13 }}
                  onClick={(e) => handleDelete(s, e)}
                  disabled={loading}
                  title="삭제"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          <div className="chat-window-header">
            <div className="chat-ai-avatar"><i className="bi bi-robot" /></div>
            <div>
              <div className="chat-ai-name">Re-Route AI</div>
              <div className="chat-ai-status">
                <span className="status-dot" />
                항상 곁에 있습니다
              </div>
            </div>
            {activeSession && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>{activeSession.title}</span>
                {activeSession.status !== 'COMPLETED' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleComplete}
                    disabled={messages.length === 0 || loading || sending}
                  >
                    {loading ? '분석 중...' : '상담 완료'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="chat-messages">
            {visibleMessages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>{msg.content}</div>
            ))}
            {sending && (
              <div className="chat-msg ai" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span>분석 중...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {riskLevel === 'HIGH' && (
            <div style={{
              margin: '0 16px 12px',
              padding: '14px 16px',
              background: '#fff5f5',
              borderRadius: 12,
              border: '1px solid #ffcccc',
              fontSize: 13,
              lineHeight: 1.6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontWeight: 600, color: '#c0392b' }}>
                <i className="bi bi-telephone-fill" />
                즉각적인 도움이 필요하다면 지금 바로 연락하세요
              </div>
              <div style={{ color: '#444' }}>
                자살예방상담전화 <strong>1393</strong>
                &nbsp;·&nbsp;정신건강위기상담전화 <strong>1577-0199</strong>
                &nbsp;·&nbsp;긴급전화 <strong>119 / 112</strong>
              </div>
            </div>
          )}

          {suggestClose && activeSession?.status !== 'COMPLETED' && (
            <div style={{
              margin: '0 16px 12px',
              padding: '12px 16px',
              background: 'var(--sage-50)',
              borderRadius: 12,
              border: '1px solid var(--sage-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <span style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.4 }}>
                <i className="bi bi-moon-stars" style={{ marginRight: 6, color: 'var(--sage-500)' }} />
                AI가 오늘 상담 마무리를 제안하고 있어요
              </span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={dismissSuggestClose}
                  disabled={loading || sending}
                >
                  계속하기
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleComplete}
                  disabled={loading || sending}
                >
                  {loading ? '분석 중...' : '마무리하기'}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSend} className="chat-input" style={{ margin: '0 16px 16px', borderRadius: 20, alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="지금 느끼는 감정을 적어보세요... (Shift+Enter로 줄바꿈)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="chat-send" style={{ flexShrink: 0 }} disabled={!input.trim() || sending}>
              <i className="bi bi-send-fill" />
            </button>
          </form>

          {error && (
            <div style={{ margin: '0 20px 18px', fontSize: 13, color: 'var(--coral-500)' }}>
              {error}
            </div>
          )}
          {notice && (
            <div style={{ margin: '0 20px 18px', fontSize: 13, color: 'var(--ink-500)' }}>
              {notice}
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div className="analysis-sidebar">
          <div className="analysis-section">
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span><i className="bi bi-activity" style={{ marginRight: 4 }} />상담 분석</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 11, padding: '3px 8px' }}
                onClick={() => navigate(`/analysis/${activeSession.id}`)}
                disabled={!activeSession || !analysis}
              >
                자세히 <i className="bi bi-arrow-right" />
              </button>
            </div>
            {analysis ? (
              <>
                <div className="struct-box" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-100)' }}>
                  <div className="struct-key">회복 유형</div>
                  <div className="struct-val">{analysis.recoveryTypeName ?? analysis.recoveryType}</div>
                </div>
                <div className="struct-box">
                  <div className="struct-key">요약</div>
                  <div className="struct-val">{analysis.summary}</div>
                </div>
                <div className="struct-box">
                  <div className="struct-key">감정 키워드</div>
                  <div className="struct-val">
                    {analysis.emotionKeywords?.length ? analysis.emotionKeywords.join(', ') : '아직 충분한 대화가 필요해요'}
                  </div>
                </div>
              </>
            ) : (
              <div className="struct-box">
                <div className="struct-key">대화 진행 중</div>
                <div className="struct-val">상담을 완료하면 회복 유형과 감정 키워드를 확인할 수 있어요.</div>
              </div>
            )}
          </div>

          <div className="analysis-section">
            <div className="panel-title">
              <i className="bi bi-diagram-3" style={{ marginRight: 4 }} />
              상담 메모
            </div>
            <div className="struct-box">
              <div className="struct-key">현재 세션</div>
              <div className="struct-val">{activeSession?.title ?? '첫 메시지를 보내면 자동으로 시작됩니다.'}</div>
            </div>
            <div className="struct-box" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-100)' }}>
              <div className="struct-key">다음 단계</div>
              <div className="struct-val">대화를 충분히 나눈 뒤 자세히 보기에서 분석 결과를 확인해보세요.</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
