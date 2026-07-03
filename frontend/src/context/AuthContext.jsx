import { createContext, useEffect, useState, useCallback } from 'react'
import AuthService from '../services/AuthService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('taskflow_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  const persistUser = (userData) => {
    if (userData) {
      localStorage.setItem('taskflow_user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('taskflow_user')
    }
    setUser(userData)
  }

  const login = async (credentials) => {
    const { data } = await AuthService.login(credentials)
    localStorage.setItem('taskflow_token', data.token)
    persistUser(data.user)
    return data
  }

  const register = async (payload) => {
    const { data } = await AuthService.register(payload)
    localStorage.setItem('taskflow_token', data.token)
    persistUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch {
      // On ignore l'erreur : on déconnecte l'utilisateur localement de toute façon.
    } finally {
      localStorage.removeItem('taskflow_token')
      persistUser(null)
    }
  }

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('taskflow_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await AuthService.me()
      persistUser(data.data ?? data)
    } catch {
      localStorage.removeItem('taskflow_token')
      persistUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    user,
    setUser: persistUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
