import { useState } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { useAuth } from '../../hooks/useAuth'
import { MOCK_GOLDEN_CARDS } from '../../data/mockQuests'
import { MOCK_USER, RESILIENCE_TYPES } from '../../data/mockUser'
import { getInitial } from '../../utils/format'

export default function MyPage() {
  const { user, logout } = useAuth()
  const displayUser = user ?? MOCK_USER
  const typeInfo = RESILIENCE_TYPES[displayUser.resilienceTypeCode] ?? {}

  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <AppLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">마이페이지</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>프로필과 회복 여정을 확인하세요</p>
      </div>

      <div className="mypage-layout">
        {/* Left: Profile Card */}
        <div>
          <div className="profile-card">
            <div className="profile-avatar">{getInitial(displayUser.nickname)}</div>
            <div className="profile-name">{displayUser.nickname}</div>
            <div className="profile-email">{displayUser.email}</div>
            <div className="profile-type-badge" style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.bg }}>
              <i className="bi bi-person-fill" />
              {typeInfo.label}
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{displayUser.questsCompleted}</div>
                <div className="profile-stat-label">완료 퀘스트</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{displayUser.streak}</div>
                <div className="profile-stat-label">연속 일수</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{displayUser.confidenceScore}</div>
                <div className="profile-stat-label">자신감</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{displayUser.avoidanceIndex}</div>
                <div className="profile-stat-label">회피 지수</div>
              </div>
            </div>

            <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={logout}>
              <i className="bi bi-box-arrow-right" /> 로그아웃
            </button>
          </div>

          {/* Recovery Type Card */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <span className="card-title">나의 회복 유형</span>
            </div>
            <div style={{
              background: typeInfo.bg, borderRadius: 'var(--radius-md)',
              padding: '16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: typeInfo.color, marginBottom: 6 }}>
                {displayUser.resilienceTypeCode}
              </div>
              <div style={{ fontWeight: 700, color: typeInfo.color, marginBottom: 4 }}>
                {typeInfo.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
                전략: {typeInfo.strategy}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="mypage-main">
          {/* Progress Overview */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <i className="bi bi-bar-chart-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
                회복 진행 현황
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: '자신감', value: displayUser.confidenceScore, max: 100, color: 'var(--sage-500)' },
                { label: '회피 감소', value: 100 - displayUser.avoidanceIndex, max: 100, color: 'var(--amber-500)' },
                { label: '퀘스트 달성', value: displayUser.questsCompleted, max: displayUser.totalQuests, color: 'var(--terra-500)' },
                { label: '연속 실천', value: displayUser.streak, max: 30, color: 'var(--sage-700)' },
              ].map(({ label, value, max, color }) => (
                <div key={label}>
                  <div className="emotion-label" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color, fontWeight: 700 }}>{value}{max === 100 ? '%' : `/${max}`}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Cards */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <i className="bi bi-star-fill" style={{ color: 'var(--amber-500)', marginRight: 6 }} />
                황금 카드 — 나의 성공 기록
              </span>
              <span className="card-badge">{MOCK_GOLDEN_CARDS.length}개</span>
            </div>
            {MOCK_GOLDEN_CARDS.map(({ id, title, detail }) => (
              <div key={id} className="gold-card" style={{ marginBottom: 10 }}>
                <div className="gold-icon">
                  <i className="bi bi-star-fill" />
                </div>
                <div>
                  <div className="gold-title">{title}</div>
                  <div className="gold-sub">{detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <i className="bi bi-gear" style={{ color: 'var(--ink-500)', marginRight: 6 }} />
                설정
              </span>
            </div>
            {[
              {
                icon: 'bi-bell',
                label: '알림 설정',
                desc: '퀘스트 및 상담 리마인더 알림',
                value: notifications,
                toggle: () => setNotifications(v => !v),
              },
              {
                icon: 'bi-moon',
                label: '다크 모드',
                desc: '어두운 테마 사용 (준비 중)',
                value: darkMode,
                toggle: () => setDarkMode(v => !v),
              },
            ].map(({ icon, label, desc, value, toggle }) => (
              <div className="settings-row" key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`bi ${icon}`} style={{ fontSize: 18, color: 'var(--sage-500)' }} />
                  <div>
                    <div className="settings-label">{label}</div>
                    <div className="settings-desc">{desc}</div>
                  </div>
                </div>
                <button className={`toggle${value ? ' on' : ''}`} onClick={toggle} aria-label={label} />
              </div>
            ))}
            <div className="settings-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="bi bi-shield-lock" style={{ fontSize: 18, color: 'var(--sage-500)' }} />
                <div>
                  <div className="settings-label">개인정보 처리방침</div>
                  <div className="settings-desc">데이터 수집 및 이용 안내</div>
                </div>
              </div>
              <i className="bi bi-chevron-right" style={{ color: 'var(--ink-300)' }} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
