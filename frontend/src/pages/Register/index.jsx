import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', nickname: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setServerError('')
  }

  function validate() {
    const next = {}
    if (!form.nickname.trim()) next.nickname = '닉네임을 입력해주세요.'
    if (!form.email) next.email = '이메일을 입력해주세요.'
    if (form.password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.'
    if (form.password !== form.passwordConfirm) next.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form.email, form.password, form.nickname)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err?.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
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

        <h1 className="auth-title">회복의 첫 걸음</h1>
        <p className="auth-subtitle">계정을 만들어보세요</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nickname">닉네임</label>
            <input
              id="nickname" name="nickname" type="text"
              className={`form-input${errors.nickname ? ' error' : ''}`}
              placeholder="표시될 이름을 입력하세요"
              value={form.nickname} onChange={onChange} autoComplete="username"
            />
            {errors.nickname && <p className="form-error">{errors.nickname}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일</label>
            <input
              id="email" name="email" type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              placeholder="example@email.com"
              value={form.email} onChange={onChange} autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              id="password" name="password" type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              placeholder="8자 이상 입력하세요"
              value={form.password} onChange={onChange} autoComplete="new-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm" name="passwordConfirm" type="password"
              className={`form-input${errors.passwordConfirm ? ' error' : ''}`}
              placeholder="비밀번호를 다시 입력하세요"
              value={form.passwordConfirm} onChange={onChange} autoComplete="new-password"
            />
            {errors.passwordConfirm && <p className="form-error">{errors.passwordConfirm}</p>}
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? '가입 중...' : '시작하기'}
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
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
