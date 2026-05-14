import { Link, useNavigate } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-mark">R</span>
          Re-Route
        </div>
        <div className="nav-links">
          <a href="#how">작동원리</a>
          <a href="#features">기능</a>
          <a href="#types">유형진단</a>
          <a href="#vr">VR 리허설</a>
          <a href="#community">커뮤니티</a>
          <Link to="/login" className="btn btn-ghost">로그인</Link>
          <Link to="/register" className="btn btn-primary">시작하기</Link>
        </div>
      </div>
    </nav>
  )
}
