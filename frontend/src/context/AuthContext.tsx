'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import {
  login as loginService,
  logout as logoutService,
} from '../services/auth'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const login = async (email: string, password: string) => {
    await loginService({ email, password })

    setIsAuthenticated(true)
  }

  const logout = () => {
    logoutService()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
