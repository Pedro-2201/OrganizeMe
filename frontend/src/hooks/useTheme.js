import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'color-scheme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function getStoredPreference() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function getSystemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function syncMetaColorScheme(preference) {
  const meta = document.querySelector('meta[name="color-scheme"]')
  if (meta) {
    meta.content = preference ?? 'light dark'
  }
}

export function useTheme() {
  const [storedPreference, setStoredPreference] = useState(getStoredPreference)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  const resolvedTheme = storedPreference ?? systemTheme
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    syncMetaColorScheme(storedPreference)
  }, [storedPreference])

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_QUERY)

    function handleSystemChange(event) {
      // Atualiza apenas a referência de sistema; não remove preferência explícita salva
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    function handleStorageChange(event) {
      if (event.key === STORAGE_KEY || event.key === null) {
        setStoredPreference(getStoredPreference())
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const currentSystem = getSystemTheme()
    const currentResolved = storedPreference ?? currentSystem
    const target = currentResolved === 'dark' ? 'light' : 'dark'

    // Se o alvo coincide com o tema atual do sistema, volta a seguir o sistema
    const nextPreference = target === currentSystem ? null : target

    try {
      if (nextPreference === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, nextPreference)
      }
    } catch {
      // Continua aplicando na sessão mesmo se localStorage estiver bloqueado
    }

    syncMetaColorScheme(nextPreference)
    setStoredPreference(nextPreference)
  }, [storedPreference])

  return {
    theme: resolvedTheme,
    storedPreference,
    isDark,
    toggleTheme,
  }
}
