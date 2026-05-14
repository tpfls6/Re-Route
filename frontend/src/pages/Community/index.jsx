import { useState } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { MOCK_CAMPFIRES } from '../../data/mockIsland'

export default function Community() {
  const [joined, setJoined] = useState(null)

  if (joined) {
    return (
      <AppLayout>
        <button className="btn btn-ghost btn-sm" onClick={() => setJoined(null)} style={{ marginBottom: 20 }}>
          <i className="bi bi-arrow-left" /> 캠프파이어 목록으로
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #2c2a26, #3a372f)',
          borderRadius: 'var(--radius-xl)',
          padding: 40, color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <i className="bi bi-fire" style={{ color: 'var(--amber-300)', fontSize: 28 }} />
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{joined.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{joined.keyword}</p>
            </div>
            <span style={{
              marginLeft: 'auto', padding: '4px 12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 100, fontSize: 13, color: 'var(--amber-300)',
            }}>
              <i className="bi bi-people-fill" style={{ marginRight: 4 }} />
              {joined.members}명 참여 중
            </span>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 'var(--radius-lg)',
            padding: 24, marginBottom: 20,
            minHeight: 280, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
          }}>
            <div className="fire" style={{ position: 'static', transform: 'none', marginBottom: 24 }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' }}>
              AI 모더레이팅 VR 캠프파이어가 준비 중입니다.<br />
              곧 실시간 음성 대화를 즐길 수 있습니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="vr-btn primary" style={{ flex: 1 }}>
              <i className="bi bi-mic-fill" /> 음성으로 참여
            </button>
            <button className="vr-btn" style={{ flex: 1 }}>
              <i className="bi bi-chat-dots" /> 텍스트로 참여
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">커뮤니티</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          같은 고민을 가진 사람들과 안전하게 연대합니다.
        </p>
      </div>

      <div className="community-card" style={{ marginBottom: 24 }}>
        <div>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--amber-300)', borderColor: 'rgba(255,255,255,0.15)', marginBottom: 16 }}>
            <span className="badge-dot" style={{ background: 'var(--amber-300)' }} /> Camp Fire
          </span>
          <h3>혼자가 아니라는 감각이<br />다시 일어설 힘을 만듭니다.</h3>
          <p>AI가 분석한 고민 키워드가 유사한 사용자들이 VR 캠프파이어에 모입니다. 실시간 음성 대화는 AI가 모더레이팅합니다.</p>
        </div>
        <div className="campfire">
          <div className="fire" />
          <div className="avatar-circle ac1"><div className="av purple" /></div>
          <div className="avatar-circle ac2"><div className="av peach" /></div>
          <div className="avatar-circle ac3"><div className="av amber" /></div>
          <div className="avatar-circle ac4"><div className="av green" /></div>
          <div className="avatar-circle ac5"><div className="av" /></div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--ink-900)' }}>
        열린 캠프파이어
      </h2>
      <div className="campfire-grid">
        {MOCK_CAMPFIRES.map(c => (
          <div key={c.id} className="campfire-card" onClick={() => setJoined(c)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="campfire-name">{c.name}</div>
              <i className="bi bi-fire" style={{ color: 'var(--amber-300)', fontSize: 18 }} />
            </div>
            <div className="campfire-desc">{c.desc}</div>
            <div className="campfire-meta">
              <i className="bi bi-people-fill" />
              <span>{c.members}명 참여 중</span>
              <span style={{ margin: '0 4px' }}>·</span>
              <span>{c.keyword}</span>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
