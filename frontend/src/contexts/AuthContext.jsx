import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { apiFetch, setUnauthorizedHandler } from '../services/api'

export function AuthProvider({ children, onSessionExpired, onNavigate }) {
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const isLoggingOutRef = useRef(false)

  // Remove resquícios de versões anteriores que guardavam token/usuário no localStorage
  useEffect(() => {
    localStorage.removeItem('organizeme_token')
    localStorage.removeItem('organizeme_user')
  }, [])

  const logout = useCallback(async ({ notifyReason } = {}) => {
    if (isLoggingOutRef.current) return
    isLoggingOutRef.current = true
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    } finally {
      setUser(null)
      if (notifyReason && onSessionExpired) {
        onSessionExpired(notifyReason)
      }
      if (onNavigate) {
        onNavigate('login')
      }
      isLoggingOutRef.current = false
    }
  }, [onSessionExpired, onNavigate])

  // Registra o handler único para respostas 401/403 vindas de qualquer chamada via apiFetch
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout({ notifyReason: 'Sua sessão expirou. Faça login novamente.' })
    })
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // Valida a sessão atual via cookie HttpOnly ao iniciar a aplicação
  useEffect(() => {
    let active = true
    async function verifySession() {
      try {
        const userData = await apiFetch('/auth/me', { skipAuthRedirect: true })
        if (active && userData) {
          setUser(userData)
        }
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setIsCheckingAuth(false)
        }
      }
    }
    verifySession()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      skipAuthRedirect: true,
      defaultErrorMessage: 'Email ou senha incorretos.',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
    const userData = { name: data.name, email: data.email }
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (userInfo) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      skipAuthRedirect: true,
      defaultErrorMessage: 'Não foi possível criar a conta. Tente novamente.',
      body: JSON.stringify({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
      }),
    })
    const userData = { name: data.name, email: data.email }
    setUser(userData)
    return userData
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isCheckingAuth,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
