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
import Onboarding from './pages/Onboarding'
import CounselingType from './pages/CounselingType'
import AnalysisDetail from './pages/AnalysisDetail'
import QuestDetail from './pages/QuestDetail'
import QuestComplete from './pages/QuestComplete'
import CommunityPostDetail from './pages/CommunityPostDetail'
import CommunityPostWrite from './pages/CommunityPostWrite'
import GoldenCards from './pages/GoldenCards'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/counseling" element={<PrivateRoute><Counseling /></PrivateRoute>} />
      <Route path="/counseling/type" element={<PrivateRoute><CounselingType /></PrivateRoute>} />
      <Route path="/analysis/:sessionId" element={<PrivateRoute><AnalysisDetail /></PrivateRoute>} />
      <Route path="/action-items" element={<PrivateRoute><ActionItems /></PrivateRoute>} />
      <Route path="/quests/:id" element={<PrivateRoute><QuestDetail /></PrivateRoute>} />
      <Route path="/quests/:id/complete" element={<PrivateRoute><QuestComplete /></PrivateRoute>} />
      <Route path="/rehearsal" element={<PrivateRoute><Rehearsal /></PrivateRoute>} />
      <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      <Route path="/community/post/:id" element={<PrivateRoute><CommunityPostDetail /></PrivateRoute>} />
      <Route path="/community/post/:id/edit" element={<PrivateRoute><CommunityPostWrite /></PrivateRoute>} />
      <Route path="/community/write" element={<PrivateRoute><CommunityPostWrite /></PrivateRoute>} />
      <Route path="/golden-cards" element={<PrivateRoute><GoldenCards /></PrivateRoute>} />
      <Route path="/my" element={<PrivateRoute><MyPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
