import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '@/constants'
import { refreshSession } from '@/features/auth/api/auth.api'
import type { AuthState, Technician } from '@/features/auth/types/auth.types'

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  isInitializing: boolean
  login: (technician: Technician, accessToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const persistedMobileNumber = localStorage.getItem(STORAGE_KEYS.SESSION_MOBILE_NUMBER)

    if (!persistedMobileNumber) {
      setIsInitializing(false)
      return
    }

    refreshSession(persistedMobileNumber)
      .then(({ technician, accessToken }) => {
        setTechnician(technician)
        setAccessToken(accessToken)
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.SESSION_MOBILE_NUMBER)
      })
      .finally(() => {
        setIsInitializing(false)
      })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      technician,
      accessToken,
      isAuthenticated: accessToken !== null,
      isInitializing,
      login: (technician, accessToken) => {
        setTechnician(technician)
        setAccessToken(accessToken)
        localStorage.setItem(STORAGE_KEYS.SESSION_MOBILE_NUMBER, technician.mobileNumber)
      },
      logout: () => {
        setTechnician(null)
        setAccessToken(null)
        localStorage.removeItem(STORAGE_KEYS.SESSION_MOBILE_NUMBER)
      },
    }),
    [technician, accessToken, isInitializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
