import { createContext, useState, useCallback } from 'react'
import { post_login, post_logout, post_register } from '../api/authApi'

export const AuthContext = createContext(null)

const unwrap = (res) => res.data?.data ?? res.data

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('reroute_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback(async (email, password) => {
    const res = await post_login(email, password)
    const { token, accessToken, refreshToken, user: userData } = unwrap(res)
    localStorage.setItem('accessToken', accessToken || token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('reroute_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (payload) => {
    const res = await post_register(payload)
    const { token, accessToken, refreshToken, user: userData } = unwrap(res)
    localStorage.setItem('accessToken', accessToken || token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('reroute_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await post_logout()
    } catch {
      // ignore server error on logout
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('reroute_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(prev => {
      const next = { ...(prev ?? {}), ...updated }
      localStorage.setItem('reroute_user', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
