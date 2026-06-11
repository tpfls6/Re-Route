import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/layout/AppLayout'
import { useModal } from '../../components/common/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useEmailVerification } from '../../hooks/useEmailVerification'
import { useMyPage } from '../../hooks/useMyPage'
import { MOCK_USER } from '../../data/mockUser'
import { get_my_quests } from '../../api/questApi'
import { get_user_stats } from '../../api/userApi'
import { getInitial } from '../../utils/format'

const unwrap = (res) => res.data?.data ?? res.data

const RECOVERY_TYPE_INFO = {
  AVOIDANT: { label: '회피형', strategy: '단계적 노출', color: 'var(--terra-500)', bg: '#ffe8dc' },
  OVERFOCUSED: { label: '과몰입형', strategy: '리프레이밍', color: 'var(--amber-500)', bg: '#f4e5d0' },
  LETHARGIC: { label: '무기력형', strategy: '1분 과제', color: 'var(--sage-700)', bg: 'var(--sage-50)' },
  RELATION_ANXIOUS: { label: '관계불안형', strategy: '대화 훈련', color: '#5a6b85', bg: '#e5e8f0' },
  PERFECTIONIST: { label: '완벽주의형', strategy: '실패 연습', color: '#8e5a8e', bg: '#f0e5f0' },
}

export default function MyPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { confirm, ModalElement } = useModal()
  const {
    profile,
    loading: profileLoading,
    saving,
    deleting,
    error: profileError,
    fetchMyPage,
    updateMyPage,
    deleteMyAccount,
  } = useMyPage()
  const {
    loading: codeLoading,
    verifying,
    issuedCode,
    verified,
    message: verificationMessage,
    error: verificationError,
    requestCode,
    verifyCode,
    resetVerification,
  } = useEmailVerification('PROFILE_UPDATE')
  const displayUser = { ...MOCK_USER, ...(user ?? {}), ...(profile ?? {}) }
  const typeInfo = RECOVERY_TYPE_INFO[displayUser.primaryRecoveryType] ?? {}

  const [form, setForm] = useState({
    nickname: displayUser.nickname ?? '',
    emailVerificationCode: '',
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  })
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [stats, setStats] = useState(null)
  const [goldenCards, setGoldenCards] = useState([])
  const [journeyLoading, setJourneyLoading] = useState(true)
  const [journeyError, setJourneyError] = useState('')

  useEffect(() => {
    fetchMyPage().catch(() => undefined)
  }, [fetchMyPage])

  useEffect(() => {
    let mounted = true
    Promise.allSettled([get_user_stats(), get_my_quests()])
      .then(([statsResult, questsResult]) => {
        if (!mounted) return
        const quests = questsResult.status === 'fulfilled' ? (unwrap(questsResult.value) ?? []) : []
        const nextStats = statsResult.status === 'fulfilled' ? unwrap(statsResult.value) : {}

        setStats({ ...nextStats, totalQuests: quests.length })
        if (questsResult.status === 'fulfilled') {
          setGoldenCards(quests.filter(quest => quest.status === 'COMPLETED'))
        }
        if (statsResult.status === 'rejected' || questsResult.status === 'rejected') {
          setJourneyError('일부 회복 여정 정보를 불러오지 못했습니다.')
        }
      })
      .finally(() => {
        if (mounted) setJourneyLoading(false)
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    setForm(prev => ({ ...prev, nickname: displayUser.nickname ?? '' }))
  }, [displayUser.nickname])

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setFormError('')
    setSuccessMessage('')
    if (e.target.name === 'emailVerificationCode') resetVerification()
  }

  async function onRequestProfileCode() {
    if (!displayUser.email) {
      setFormError('이메일 정보를 확인할 수 없습니다.')
      return
    }
    try {
      await requestCode(displayUser.email)
    } catch {
      // hook state drives the message
    }
  }

  async function onVerifyProfileCode() {
    if (!form.emailVerificationCode.trim()) {
      setFormError('인증코드를 입력해주세요.')
      return
    }
    try {
      await verifyCode(displayUser.email, form.emailVerificationCode)
    } catch {
      // hook state drives the message
    }
  }

  async function onSubmitProfile(e) {
    e.preventDefault()
    const wantsPassword = form.currentPassword || form.newPassword || form.newPasswordConfirm
    const nicknameChanged = form.nickname.trim() && form.nickname.trim() !== displayUser.nickname

    if (!nicknameChanged && !wantsPassword) {
      setFormError('수정할 닉네임 또는 새 비밀번호를 입력해주세요.')
      return
    }
    if (!form.emailVerificationCode.trim() || !verified) {
      setFormError('프로필 수정을 위해 이메일 인증을 완료해주세요.')
      return
    }
    if (wantsPassword && form.newPassword !== form.newPasswordConfirm) {
      setFormError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      await updateMyPage({
        nickname: nicknameChanged ? form.nickname.trim() : undefined,
        emailVerificationCode: form.emailVerificationCode,
        currentPassword: wantsPassword ? form.currentPassword : undefined,
        newPassword: wantsPassword ? form.newPassword : undefined,
        newPasswordConfirm: wantsPassword ? form.newPasswordConfirm : undefined,
      })
      setForm(prev => ({
        ...prev,
        emailVerificationCode: '',
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      }))
      resetVerification()
      setSuccessMessage(wantsPassword ? '프로필이 수정되었습니다. 비밀번호를 변경했다면 다시 로그인해주세요.' : '프로필이 수정되었습니다.')
    } catch {
      // hook state drives the message
    }
  }

  async function onDeleteAccount() {
    const ok = await confirm({
      icon: 'bi-person-x-fill',
      title: '회원 탈퇴',
      message: '정말 회원 탈퇴를 진행할까요?\n계정 데이터가 영구 삭제됩니다.',
      confirmLabel: '탈퇴',
      danger: true,
    })
    if (!ok) return
    try {
      await deleteMyAccount()
      navigate('/', { replace: true })
    } catch {
      // hook state drives the message
    }
  }

  async function onLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const journeyStats = {
    questsCompleted: stats?.questsCompleted ?? 0,
    totalQuests: stats?.totalQuests ?? 0,
    actionItemsCompleted: stats?.actionItemsCompleted ?? 0,
    streakDays: stats?.streakDays ?? 0,
    confidenceScore: stats?.confidenceScore ?? 0,
    totalSessions: stats?.totalSessions ?? 0,
  }

  return (
    <AppLayout>
      {ModalElement}
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
            {displayUser.primaryRecoveryType ? (
              <div className="profile-type-badge" style={{ background: typeInfo.bg, color: typeInfo.color, borderColor: typeInfo.bg }}>
                <i className="bi bi-person-fill" />
                {typeInfo.label}
              </div>
            ) : (
              <div className="profile-type-badge" style={{ background: 'var(--line)', color: 'var(--ink-400)', borderColor: 'var(--line)' }}>
                <i className="bi bi-question-circle" />
                유형 미설정
              </div>
            )}

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{journeyLoading ? '—' : journeyStats.questsCompleted}</div>
                <div className="profile-stat-label">완료 퀘스트</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{journeyLoading ? '—' : journeyStats.streakDays}</div>
                <div className="profile-stat-label">연속 일수</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{journeyLoading ? '—' : journeyStats.confidenceScore}</div>
                <div className="profile-stat-label">자신감</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{journeyLoading ? '—' : journeyStats.totalSessions}</div>
                <div className="profile-stat-label">상담 횟수</div>
              </div>
            </div>

            <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={onLogout}>
              <i className="bi bi-box-arrow-right" /> 로그아웃
            </button>
          </div>

          {/* Recovery Type Card */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <span className="card-title">나의 회복 유형</span>
            </div>
            {displayUser.primaryRecoveryType ? (
              <div style={{
                background: typeInfo.bg, borderRadius: 'var(--radius-md)',
                padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: typeInfo.color, marginBottom: 4 }}>
                  {typeInfo.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 14 }}>
                  전략: {typeInfo.strategy}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', borderColor: typeInfo.color, color: typeInfo.color }}
                  onClick={() => navigate('/onboarding?retake=true')}
                >
                  <i className="bi bi-arrow-repeat" /> 유형 재검사하기
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 13, color: 'var(--ink-400)', marginBottom: 14 }}>
                  아직 유형 검사를 하지 않았어요.
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/onboarding')}
                >
                  <i className="bi bi-clipboard-check" /> 유형 검사 시작하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Main Content */}
        <div className="mypage-main">
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <i className="bi bi-person-gear" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
                프로필 수정
              </span>
              {profileLoading && <span className="card-badge">불러오는 중</span>}
            </div>

            {(profileError || verificationError || formError) && (
              <div className="alert alert-error">{profileError || verificationError || formError}</div>
            )}
            {(successMessage || verificationMessage) && (
              <div className="alert alert-success">{successMessage || verificationMessage}</div>
            )}

            <form className="profile-form" onSubmit={onSubmitProfile}>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="mypage-email">이메일</label>
                  <input
                    id="mypage-email"
                    className="form-input"
                    value={displayUser.email ?? ''}
                    disabled
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="mypage-nickname">닉네임</label>
                  <input
                    id="mypage-nickname"
                    name="nickname"
                    className="form-input"
                    value={form.nickname}
                    onChange={onChange}
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mypage-code">이메일 인증코드</label>
                <div className="form-inline">
                  <input
                    id="mypage-code"
                    name="emailVerificationCode"
                    className="form-input"
                    placeholder="현재 이메일로 받은 인증코드"
                    value={form.emailVerificationCode}
                    onChange={onChange}
                    inputMode="numeric"
                  />
                  <button type="button" className="btn btn-ghost btn-sm form-inline-button" onClick={onRequestProfileCode} disabled={codeLoading}>
                    {codeLoading ? '발급 중...' : '코드 발급'}
                  </button>
                  <button type="button" className="btn btn-primary btn-sm form-inline-button" onClick={onVerifyProfileCode} disabled={verifying || verified}>
                    {verified ? '인증 완료' : verifying ? '확인 중...' : '확인'}
                  </button>
                </div>
                {issuedCode && !verified && <p className="form-hint">개발용 코드: {issuedCode}</p>}
              </div>

              <div className="profile-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="currentPassword">현재 비밀번호</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className="form-input"
                    placeholder="비밀번호 변경 시 입력"
                    value={form.currentPassword}
                    onChange={onChange}
                    autoComplete="current-password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="newPassword">새 비밀번호</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="form-input"
                    placeholder="8자 이상"
                    value={form.newPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="newPasswordConfirm">새 비밀번호 확인</label>
                  <input
                    id="newPasswordConfirm"
                    name="newPasswordConfirm"
                    type="password"
                    className="form-input"
                    placeholder="새 비밀번호 재입력"
                    value={form.newPasswordConfirm}
                    onChange={onChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <i className="bi bi-check2" /> {saving ? '저장 중...' : '변경사항 저장'}
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeleteAccount} disabled={deleting}>
                  <i className="bi bi-person-x" /> {deleting ? '탈퇴 중...' : '회원 탈퇴'}
                </button>
              </div>
            </form>
          </div>

          {/* Progress Overview */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <i className="bi bi-bar-chart-fill" style={{ color: 'var(--sage-500)', marginRight: 6 }} />
                회복 진행 현황
              </span>
            </div>
            {journeyError && <div className="alert alert-error">{journeyError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: '자신감', value: journeyStats.confidenceScore, max: 100, color: 'var(--sage-500)' },
                { label: '퀘스트 달성', value: journeyStats.questsCompleted, max: journeyStats.totalQuests, color: 'var(--terra-500)' },
                { label: '액션 아이템 완료', value: journeyStats.actionItemsCompleted, max: Math.max(10, journeyStats.actionItemsCompleted), color: 'var(--amber-500)' },
                { label: '연속 실천', value: journeyStats.streakDays, max: 30, color: 'var(--sage-700)' },
              ].map(({ label, value, max, color }) => (
                <div key={label}>
                  <div className="emotion-label" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color, fontWeight: 700 }}>{value}{max === 100 ? '%' : `/${max}`}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%`, background: color }} />
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
              <span className="card-badge">{journeyLoading ? '—' : `${goldenCards.length}개`}</span>
            </div>
            {!journeyLoading && !journeyError && goldenCards.length === 0 && (
              <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>아직 완료한 퀘스트가 없어요.</div>
            )}
            {goldenCards.slice(0, 3).map(quest => (
              <div
                key={quest.id}
                className="gold-card"
                style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => navigate('/golden-cards')}
              >
                <div className="gold-icon">
                  <i className="bi bi-star-fill" />
                </div>
                <div>
                  <div className="gold-title">{quest.title}</div>
                  <div className="gold-sub">
                    {quest.recoveryTypeName} · {quest.estimatedMinutes}분
                  </div>
                </div>
              </div>
            ))}
            {goldenCards.length > 3 && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/golden-cards')}>
                전체 보기 <i className="bi bi-arrow-right" />
              </button>
            )}
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
