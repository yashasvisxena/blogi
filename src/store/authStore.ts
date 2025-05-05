'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  setUser: (user: any) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      logout: () => {
        set({ isAuthenticated: false, user: null })
        localStorage.removeItem('auth-storage')
      },
    }),
    {
      name: 'auth-storage',
    }
  )
) 