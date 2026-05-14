import { useState } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { MOCK_SCENARIOS } from '../../data/mockIsland'

export default function Rehearsal() {
  const [selected, setSelected] = useState(null)

  function handleStart(scenario) {
    setSelected(scenario)
  }

  if (selected) {
    return (
      <AppLayout>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: 20 }}>
          <i className="bi bi-arrow-left" /> 시나리오 목록으로
        </button>
        <div className="vr-wrap" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '48px 40px', position: 'relative', zIndex: 1 }}>
            <div className="section-tag">VR Mind Rehearsal</div>
            <h2 className="section-title" style={{ color: 'white', margin: '12px 0 8px' }}>{selected.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>{selected.desc}</p>

            <div className="vr-stage" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div className="vr-scene-label">SCENE · {selected.name}</div>
              <div className="vr-recording-bar"><span className="recording-dot" /> REC 00:00</div>
              <div className="npc-bubble">
                <div className="npc-name">NPC · AI 상대</div>
                <div className="npc-text">"시작할 준비가 되셨나요? 편안하게 시작해보세요."</div>
              </div>
              <div className="vr-controls">
                <button className="vr-btn" onClick={() => setSelected(null)}>나가기</button>
                <button className="vr-btn primary">답변하기</button>
                <button className="vr-btn">다시</button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">VR 마인드 리허설</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          두려운 상황을 안전한 공간에서 미리 연습합니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20, background: 'var(--ink-900)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-sm)',
            background: 'rgba(240,198,116,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-headset-vr" style={{ color: 'var(--amber-300)', fontSize: 22 }} />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 2 }}>VR 기기 없이도 이용 가능</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              모바일·PC 브라우저에서 3D 모드로 바로 참여할 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      <div className="scenario-grid">
        {MOCK_SCENARIOS.map(s => (
          <div key={s.id} className="scenario-card">
            <div className="scenario-icon">
              <i className={`bi ${s.icon}`} style={{ fontSize: 40, color: 'var(--sage-500)' }} />
            </div>
            <div className="scenario-name">{s.name}</div>
            <div className="scenario-desc">{s.desc}</div>
            <span className={`scenario-difficulty quest-level ${s.diffClass}`}>{s.diffLabel}</span>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => handleStart(s)}>
                <i className="bi bi-play-fill" /> 시작하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
