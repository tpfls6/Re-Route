import { useState, useRef, useEffect } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { MOCK_SESSIONS, MOCK_MESSAGES, MOCK_ANALYSIS } from '../../data/mockCounseling'

export default function Counseling() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [activeSession, setActiveSession] = useState(MOCK_SESSIONS[0])
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [analysis] = useState(MOCK_ANALYSIS)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSelectSession(s) {
    setActiveSession(s)
    setMessages(MOCK_MESSAGES)
  }

  async function handleNewSession() {
    const title = `새 상담 ${sessions.length + 1}`
    const newSession = { id: Date.now(), title, createdAt: new Date().toISOString().slice(0, 10), messageCount: 0 }
    setSessions(prev => [newSession, ...prev])
    setActiveSession(newSession)
    setMessages([{
      id: 1, role: 'ai',
      content: '안녕하세요. 오늘은 어떤 일이 있으셨나요?',
      createdAt: new Date().toISOString(),
    }])
  }

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)

    const userMsg = { id: Date.now(), role: 'user', content: text, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])

    // simulate AI response
    await new Promise(r => setTimeout(r, 900))
    const aiMsg = {
      id: Date.now() + 1, role: 'ai',
      content: '말씀해주신 내용을 잘 들었어요. 그 상황에서 어떤 감정이 가장 강하게 느껴지셨나요?',
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, aiMsg])
    setSending(false)
  }

  return (
    <AppLayout>
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
            <button className="btn btn-primary btn-sm" onClick={handleNewSession}>
              <i className="bi bi-plus" />
            </button>
          </div>
          <div className="session-list">
            {sessions.map(s => (
              <div
                key={s.id}
                className={`session-list-item${activeSession?.id === s.id ? ' active' : ''}`}
                onClick={() => handleSelectSession(s)}
              >
                <div className="session-list-title">{s.title}</div>
                <div className="session-list-date">{s.createdAt}</div>
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
              <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-500)' }}>
                {activeSession.title}
              </div>
            )}
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
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

          <form onSubmit={handleSend} className="chat-input" style={{ margin: '0 16px 16px', borderRadius: 100 }}>
            <input
              type="text"
              placeholder="지금 느끼는 감정을 적어보세요..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send" disabled={!input.trim() || sending}>
              <i className="bi bi-send-fill" />
            </button>
          </form>
        </div>

        {/* Analysis Panel */}
        <div className="analysis-sidebar">
          <div className="analysis-section">
            <div className="panel-title">
              <i className="bi bi-activity" style={{ marginRight: 4 }} />
              실시간 감정 분석
            </div>
            {analysis.emotions.map(({ label, value, color }) => (
              <div className="emotion-bar" key={label}>
                <div className="emotion-label">
                  <span>{label}</span><span className="num">{value}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${value}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="analysis-section">
            <div className="panel-title">
              <i className="bi bi-diagram-3" style={{ marginRight: 4 }} />
              사건-감정-원인-대응
            </div>
            <div className="struct-box">
              <div className="struct-key">사건</div>
              <div className="struct-val">{analysis.structure.event}</div>
            </div>
            <div className="struct-box">
              <div className="struct-key">감정</div>
              <div className="struct-val">{analysis.structure.emotion}</div>
            </div>
            <div className="struct-box">
              <div className="struct-key">원인</div>
              <div className="struct-val">{analysis.structure.cause}</div>
            </div>
            <div className="struct-box" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-100)' }}>
              <div className="struct-key">대응 (Action-Item)</div>
              <div className="struct-val">{analysis.structure.action}</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
