'use client'

import { useEffect } from 'react'
import { useAuth } from '@/services/AuthService'
import { useAuthStore } from '@/store/authStore'
import { RefreshCcw } from 'lucide-react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { useUser } = useAuth()
  const { data: user, isLoading, error } = useUser({
    retry: false,
    refetchOnWindowFocus: false,
  })
  const { setIsAuthenticated, setUser, setAccessToken } = useAuthStore()

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setUser(user)
    }
  }, [user, setIsAuthenticated, setUser])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCcw className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  // If there's an error or no user, just render children
  // The interceptor will handle auth state
  return <>{children}</>
} 