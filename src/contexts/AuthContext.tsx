'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  userId: string | null
  username: string | null
  token: string | null
  setAuthData: (userId: string, token: string, username: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id')
    const storedToken = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')

    if (storedUserId) setUserId(storedUserId)
    if (storedToken) setToken(storedToken)
    if (storedUsername) setUsername(storedUsername)

    setIsLoading(false)
  }, [])

  const setAuthData = (userId: string, token: string, username: string) => {
    localStorage.setItem('user_id', userId)
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)

    setUserId(userId)
    setToken(token)
    setUsername(username)
  }

  const logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    setUserId(null)
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ userId, username, token, setAuthData, logout, isLoading }}>
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
