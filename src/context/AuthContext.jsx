import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, ApiError } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // 'loading' until we know whether the session cookie is still good, so
  // guarded pages do not flash the sign-in form at someone already signed in.
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    api
      .get('/auth/me', { signal: controller.signal })
      .then((data) => setUser(data.user))
      .catch((error) => {
        if (error?.name !== 'AbortError') setUser(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setStatus('ready')
      })

    return () => controller.abort()
  }, [])

  const register = useCallback(async (details) => {
    const { user: next } = await api.post('/auth/register', details)
    setUser(next)
    return next
  }, [])

  const login = useCallback(async (credentials) => {
    const { user: next } = await api.post('/auth/login', credentials)
    setUser(next)
    return next
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (details) => {
    const { user: next } = await api.patch('/auth/me', details)
    setUser(next)
    return next
  }, [])

  const changePassword = useCallback(
    (passwords) => api.post('/auth/password', passwords),
    []
  )

  const value = useMemo(
    () => ({
      user,
      status,
      ready: status === 'ready',
      register,
      login,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, status, register, login, logout, updateProfile, changePassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export { ApiError }
