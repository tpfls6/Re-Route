import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getInitial } from '../../utils/format'

const NAV_ITEMS = [
  { path: '/dashboard', label: '홈' },
  { path: '/counseling', label: 'AI 상담' },
  { path: '/quests', label: '퀘스트' },
  { path: '/golden-cards', label: '황금카드' },
  { path: '/rehearsal', label: 'VR 리허설' },
  { path: '/community', label: '커뮤니티' },
]

export function AppNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <div className="logo" onClick={() => navigate('/dashboard')} style={{ fontSize: '18px' }}>
          <span className="logo-mark">R</span>
          Re-Route
        </div>

        <div className="app-nav-links">
          {NAV_ITEMS.map(({ path, label }) => (
            <button
              key={path}
              className={`app-nav-link${location.pathname === path ? ' active' : ''}`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
          {user?.role === 'ADMIN' && (
            <button
              className={`app-nav-link${location.pathname === '/admin' ? ' active' : ''}`}
              onClick={() => navigate('/admin')}
              style={{ color: 'var(--coral-500)' }}
            >
              관리자
            </button>
          )}
        </div>

        <div className="app-nav-user">
          <div
            className="app-nav-avatar"
            onClick={() => navigate('/my')}
            style={{ cursor: 'pointer' }}
            title="마이페이지"
          >
            {getInitial(user?.nickname)}
          </div>
          <span className="app-nav-name">{user?.nickname}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
    </nav>
  )
}
