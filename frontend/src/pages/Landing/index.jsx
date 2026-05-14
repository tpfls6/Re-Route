import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge">
              <span className="badge-dot" />
              행동 회복 루프 플랫폼
            </span>
            <h1 className="hero-title">
              무너진 마음을<br />
              다시 <span className="underline">길 위에</span> 세우는<br />
              <span className="accent">Re-Route</span>
            </h1>
            <p className="hero-desc">
              AI 상담으로 문제를 정의하고, VR 리허설로 실전 감각을 익히며,
              성장을 시각화하는 보상 시스템으로 자립을 돕는 통합 심리 케어 플랫폼.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                시작하기
              </button>
              <a href="#how" className="btn btn-ghost btn-lg">작동 원리 보기</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card vc-1">
              <div className="chat-bubble user">발표가 너무 두려워요</div>
              <div className="chat-bubble ai">'두려움'을 분석했어요. 사건과 감정을 함께 정리해볼까요?</div>
            </div>
            <div className="visual-card vc-2">
              <div style={{ fontSize: '11px', color: 'var(--ink-500)', fontWeight: 600, marginBottom: 10 }}>
                오늘의 마이크로 퀘스트
              </div>
              <div className="quest-card-mini">
                <span className="quest-check"><i className="bi bi-check-lg" /></span>
                <span className="quest-text">자기소개 첫 문장만 녹음하기</span>
              </div>
            </div>
            <div className="visual-card vc-3">
              <div style={{ fontSize: '11px', color: 'var(--ink-500)', fontWeight: 600, marginBottom: 8 }}>
                마인드 아일랜드
              </div>
              <div className="island-mini">
                <div className="tree" style={{ left: '25%' }} />
                <div className="tree" style={{ left: '45%', bottom: '18px' }} />
                <div className="tree" style={{ left: '70%', bottom: '12px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Behavioral Recovery Loop ── */}
      <div className="loop-wrap" id="how">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Behavioral Recovery Loop</div>
            <h2 className="section-title">위로하지 않습니다.<br />다시 행동하게 만듭니다.</h2>
            <p className="section-desc">
              Re-Route는 4단계의 행동 회복 루프를 통해 사용자가 회피하던 현실에 다시 접근하도록 돕습니다.
            </p>
          </div>
          <div className="loop-grid">
            {[
              { n: 1, title: '감정 구조화', desc: '막연한 불안을 사건·감정·생각·행동으로 분해해 시각화합니다.' },
              { n: 2, title: '유형 진단', desc: '5가지 회복탄력성 유형을 분석해 맞춤 전략을 매칭합니다.' },
              { n: 3, title: '안전한 사전 경험', desc: 'VR/3D 리허설로 두려운 상황을 실패 부담 없이 연습합니다.' },
              { n: 4, title: '마이크로 실천', desc: '1분 단위 행동 과제로 가상의 연습을 현실 행동으로 연결합니다.' },
            ].map(({ n, title, desc }) => (
              <div className="loop-step" key={n}>
                <div className="loop-num">{n}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Counseling Demo ── */}
      <section id="features">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">AI Counseling</div>
            <h2 className="section-title">대화하는 동안<br />문제는 구조화됩니다.</h2>
            <p className="section-desc">
              멀티모달 AI가 사용자의 감정 상태를 실시간으로 분석하고,
              대화 내용을 사건-감정-원인-대응으로 자동 정리합니다.
            </p>
          </div>

          <div className="demo-screen">
            <div className="demo-header">
              <span className="traffic r" /><span className="traffic y" /><span className="traffic g" />
              <span className="demo-url">re-route.app / counseling</span>
            </div>
            <div className="chat-area">
              <div className="chat-main">
                <div className="chat-msg ai">안녕하세요. 오늘은 어떤 일이 있으셨나요?</div>
                <div className="chat-msg user">다음 주 발표가 있는데 자료를 못 만들겠어요.</div>
                <div className="chat-msg ai">시작이 어렵게 느껴지시는군요. '회피', '압박감', '완벽에 대한 두려움' 중 어떤 게 가장 가까울까요?</div>
                <div className="chat-msg user">완벽에 대한 두려움이 큰 것 같아요.</div>
                <div className="chat-msg ai">지금 발표 자료의 '제목 한 줄'만 적어보는 건 어떨까요? 1분이면 충분합니다.</div>
                <div className="chat-input">
                  <input type="text" placeholder="지금 느끼는 감정을 적어보세요..." readOnly />
                  <button className="chat-send"><i className="bi bi-send-fill" /></button>
                </div>
              </div>
              <div className="analysis-panel">
                <div className="panel-title">실시간 감정 분석</div>
                {[
                  { label: '불안', value: 72, color: 'var(--terra-500)' },
                  { label: '완벽주의', value: 68, color: 'var(--amber-500)' },
                  { label: '회피 경향', value: 54, color: 'var(--sage-500)' },
                ].map(({ label, value, color }) => (
                  <div className="emotion-bar" key={label}>
                    <div className="emotion-label">
                      <span>{label}</span><span className="num">{value}%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${value}%`, background: color }} />
                    </div>
                  </div>
                ))}
                <div className="panel-title" style={{ marginTop: 24 }}>사건-감정-원인-대응</div>
                {[
                  { key: '사건', val: '다음 주 발표 준비' },
                  { key: '감정', val: '압박감, 회피' },
                  { key: '원인', val: '완벽주의 + 평가 두려움' },
                ].map(({ key, val }) => (
                  <div className="struct-box" key={key}>
                    <div className="struct-key">{key}</div>
                    <div className="struct-val">{val}</div>
                  </div>
                ))}
                <div className="struct-box" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-100)' }}>
                  <div className="struct-key">대응 (Action-Item)</div>
                  <div className="struct-val">제목 한 줄만 작성하기 · 1분</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── User Types ── */}
      <section id="types" style={{ background: 'var(--bg-soft)' }}>
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Resilience Type Engine</div>
            <h2 className="section-title">5가지 유형, 5가지 전략</h2>
            <p className="section-desc">
              AI가 NLP 기반 분석으로 사용자의 회복탄력성 유형을 분류하고, 각 유형에 최적화된 행동 처방을 동적으로 제공합니다.
            </p>
          </div>
          <div className="types-grid">
            {[
              { cls: 't1', letter: 'A', name: '회피형', desc: '무서운 상황을 계속 피함', tag: '# 단계적 노출' },
              { cls: 't2', letter: 'B', name: '과몰입형', desc: '실패 하나를 크게 받아들임', tag: '# 리프레이밍' },
              { cls: 't3', letter: 'C', name: '무기력형', desc: '시작 자체가 어려움', tag: '# 1분 과제' },
              { cls: 't4', letter: 'D', name: '관계불안형', desc: '타인의 반응을 과도하게 걱정', tag: '# 대화 훈련' },
              { cls: 't5', letter: 'E', name: '완벽주의형', desc: '잘해야만 시작함', tag: '# 실패 연습' },
            ].map(({ cls, letter, name, desc, tag }) => (
              <div className="type-card" key={letter}>
                <div className={`type-emoji ${cls}`}>{letter}</div>
                <div className="type-name">{name}</div>
                <div className="type-desc">{desc}</div>
                <div className="type-tag">{tag}</div>
              </div>
            ))}
          </div>
          <div className="quest-grid">
            {[
              { cls: 'ql1', level: 'Level 1 · 1분', title: '현관 앞에 30초 서 있기', meta: '회피형 · 무기력형' },
              { cls: 'ql2', level: 'Level 2 · 5분', title: '자기소개 첫 문장만 녹음하기', meta: '관계불안형 · 완벽주의형' },
              { cls: 'ql3', level: 'Level 3 · 15분', title: '집 앞 편의점에서 물건 사기', meta: '회피형 · 단계적 노출 마지막 단계' },
            ].map(({ cls, level, title, meta }) => (
              <div className="quest-card" key={title}>
                <span className={`quest-level ${cls}`}>{level}</span>
                <div className="quest-title">{title}</div>
                <div className="quest-meta">{meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Core Capabilities</div>
            <h2 className="section-title">상담은 시작일 뿐입니다.</h2>
          </div>
          <div className="features-grid">
            {[
              {
                variant: '', icon: 'bi-robot', title: '멀티모달 AI 상담',
                desc: '텍스트와 음성 분석으로 24시간 1차 심리 케어를 제공합니다.',
                items: ['감정 분류와 강도 측정', '대화 내용 자동 구조화', 'Action-Item 자동 추출'],
              },
              {
                variant: 'accent', icon: 'bi-headset-vr', title: 'VR 마인드 리허설',
                desc: '두려운 상황을 가상으로 미리 경험해 실패 부담을 제거합니다.',
                items: ['면접·발표·사과·거절 시나리오', 'AI NPC 실시간 상호작용', '음성 톤·시선·답변 분석 리포트'],
              },
              {
                variant: 'dark', icon: 'bi-tree', title: '마인드 아일랜드',
                desc: '현실의 실천이 VR 정원의 시각적 성장으로 치환됩니다.',
                items: ['퀘스트 달성 시 정원 확장', '황금 카드로 성공 기록 보관', 'AI 성장 리포트 자동 발행'],
              },
              {
                variant: '', icon: 'bi-people', title: 'AI 모더레이팅 커뮤니티',
                desc: '유사 고민을 가진 유저들이 안전하게 연대하는 공간입니다.',
                items: ['키워드 기반 사용자 매칭', '실시간 대화 필터링', 'VR 캠프파이어 음성 모임'],
              },
            ].map(({ variant, icon, title, desc, items }) => (
              <div className={`feature-card${variant ? ' ' + variant : ''}`} key={title}>
                <div className="feat-icon"><i className={`bi ${icon}`} /></div>
                <div className="feat-title">{title}</div>
                <div className="feat-desc">{desc}</div>
                <ul className="feat-list">
                  {items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VR Section ── */}
      <div className="vr-wrap" id="vr">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">VR Mind Rehearsal</div>
            <h2 className="section-title">실패가 안전한 공간에서<br />실전 감각을 키웁니다.</h2>
            <p className="section-desc">
              VR 기기가 없어도 모바일·PC의 3D 모드로 참여 가능한 하이브리드 환경을 제공합니다.
            </p>
          </div>
          <div className="vr-grid">
            <div className="vr-stage">
              <div className="vr-scene-label">SCENE · 면접 리허설</div>
              <div className="vr-recording-bar">
                <span className="recording-dot" /> REC 02:14
              </div>
              <div className="npc-bubble">
                <div className="npc-name">NPC · 김 면접관</div>
                <div className="npc-text">"그렇다면 본인의 가장 큰 약점이 뭐라고 생각하시나요?"</div>
              </div>
              <div className="vr-controls">
                <button className="vr-btn">일시정지</button>
                <button className="vr-btn primary">답변하기</button>
                <button className="vr-btn">다시</button>
              </div>
            </div>
            <ul className="vr-list">
              {[
                { n: '01', title: '맞춤형 시나리오 생성', desc: '사용자가 두려워하는 상황을 즉시 가상 환경으로 구현합니다.' },
                { n: '02', title: 'AI NPC 실시간 반응', desc: '대화 흐름에 따라 Best/Worst 시나리오가 동적으로 분기됩니다.' },
                { n: '03', title: '객관적 데이터 피드백', desc: '음성 톤, 시선 처리, 답변의 적절성을 분석한 리포트를 받습니다.' },
              ].map(({ n, title, desc }) => (
                <li key={n}>
                  <div className="vr-list-num">{n}</div>
                  <div><h5>{title}</h5><p>{desc}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Reward / Island ── */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Reward System</div>
            <h2 className="section-title">회복은 보이지 않지만,<br />성장은 보여야 합니다.</h2>
            <p className="section-desc">
              현실의 작은 실천이 VR 정원의 가시적 성장으로 변환되어 지속 가능한 동기를 만듭니다.
            </p>
          </div>
          <div className="reward-grid">
            <div className="island-card">
              <div className="island-stat">
                <div className="island-stat-label">완료한 퀘스트</div>
                <div className="island-stat-value">28 / 40</div>
              </div>
              <div className="island-ground" />
              {['t-a', 't-b', 't-c', 't-d'].map(cls => (
                <div key={cls} className={`island-tree ${cls}`}>
                  <div className="crown" /><div className="trunk" />
                </div>
              ))}
              <div className="flower f1" /><div className="flower f2" /><div className="flower f3" />
            </div>
            <div className="golden-cards">
              {[
                { title: '첫 발표 리허설 완료', sub: '2026.05.04 · 자신감 점수 +18' },
                { title: '회피하던 메일에 답장 보내기', sub: '2026.05.06 · 회피 지수 -12' },
                { title: '7일 연속 마이크로 퀘스트 달성', sub: '2026.05.07 · 행동 일관성 배지 획득' },
              ].map(({ title, sub }) => (
                <div className="gold-card" key={title}>
                  <div className="gold-icon"><i className="bi bi-star-fill" /></div>
                  <div><div className="gold-title">{title}</div><div className="gold-sub">{sub}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Community ── */}
      <section id="community">
        <div className="container">
          <div className="community-card">
            <div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--amber-300)', borderColor: 'rgba(255,255,255,0.15)' }}>
                <span className="badge-dot" style={{ background: 'var(--amber-300)' }} /> Camp Fire
              </span>
              <h3>혼자가 아니라는 감각이<br />다시 일어설 힘을 만듭니다.</h3>
              <p>AI가 분석한 고민 키워드가 유사한 사용자들이 VR 캠프파이어에 모입니다. 실시간 음성 대화는 AI가 모더레이팅하며, 부정적 감정 전염을 차단합니다.</p>
              <button className="btn btn-on-dark" onClick={() => navigate('/register')}>캠프파이어 둘러보기</button>
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
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-section">
        <h2>당신의 다음 한 걸음,<br />Re-Route와 함께.</h2>
        <p>전문 상담은 회당 10만 원 이상이지만, Re-Route는 24시간 곁에 있습니다.</p>
        <button className="btn btn-on-dark btn-lg" onClick={() => navigate('/register')}>시작하기</button>
      </div>

      <Footer />
    </>
  )
}
