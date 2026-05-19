import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('7titaaa_token'))

  useEffect(() => {
    const token = localStorage.getItem('7titaaa_token')
    if (!token) return
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('7titaaa_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('7titaaa_token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('7titaaa_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('7titaaa_token')
    setUser(null)
  }

  const updateProfile = async (name, email) => {
    const { data } = await api.put('/auth/profile', { name, email })
    localStorage.setItem('7titaaa_token', data.token)
    setUser(data.user)
    return data.user
  }

  const changePassword = async (currentPassword, newPassword) => {
    await api.put('/auth/password', { currentPassword, newPassword })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
