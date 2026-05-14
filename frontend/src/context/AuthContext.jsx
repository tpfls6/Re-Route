import { createContext, useState, useCallback } from 'react'
import { post_login, post_logout, post_register } from '../api/authApi'

export const AuthContext = createContext(null)

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
    const { token, user: userData } = res.data.data
    localStorage.setItem('accessToken', token)
    localStorage.setItem('reroute_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (email, password, nickname) => {
    const res = await post_register(email, password, nickname)
    const { token, user: userData } = res.data.data
    localStorage.setItem('accessToken', token)
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
    localStorage.removeItem('reroute_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    const next = { ...user, ...updated }
    localStorage.setItem('reroute_user', JSON.stringify(next))
    setUser(next)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
