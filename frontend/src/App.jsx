import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { PrivateRoute } from './routes/PrivateRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Counseling from './pages/Counseling'
import ActionItems from './pages/ActionItems'
import Rehearsal from './pages/Rehearsal'
import Community from './pages/Community'
import MyPage from './pages/MyPage'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/counseling" element={<PrivateRoute><Counseling /></PrivateRoute>} />
      <Route path="/action-items" element={<PrivateRoute><ActionItems /></PrivateRoute>} />
      <Route path="/rehearsal" element={<PrivateRoute><Rehearsal /></PrivateRoute>} />
      <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      <Route path="/my" element={<PrivateRoute><MyPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
