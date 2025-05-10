'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  userId: string | null
  token: string | null
  setAuthData: (userId: string, token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id')
    const storedToken = localStorage.getItem('token')
    if (storedUserId) setUserId(storedUserId)
    if (storedToken) setToken(storedToken)
    setIsLoading(false)
  }, [])

  const setAuthData = (userId: string, token: string) => {
    localStorage.setItem('user_id', userId)
    localStorage.setItem('token', token)
    setUserId(userId)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('token')
    setUserId(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ userId, token, setAuthData, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
