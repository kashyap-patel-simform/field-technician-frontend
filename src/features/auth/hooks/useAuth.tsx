import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthState, Technician } from '@/features/auth/types/auth.types'

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  login: (technician: Technician, accessToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const value = useMemo<AuthContextValue>(
    () => ({
      technician,
      accessToken,
      isAuthenticated: accessToken !== null,
      login: (technician, accessToken) => {
        setTechnician(technician)
        setAccessToken(accessToken)
      },
      logout: () => {
        setTechnician(null)
        setAccessToken(null)
      },
    }),
    [technician, accessToken],
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
