import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">R</div>
          <span className="auth-logo-text">Re-Route</span>
        </div>

        <h1 className="auth-title">다시 시작하는 여정</h1>
        <p className="auth-subtitle">계정에 로그인하세요</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="example@email.com"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> 로그인 중...</>
              : '로그인'
            }
          </button>
        </form>

        <p className="auth-footer">
          아직 계정이 없으신가요?{' '}
          <Link to="/register">시작하기</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: 'var(--ink-500)', fontSize: 12 }}>
            <i className="bi bi-arrow-left" /> 홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
