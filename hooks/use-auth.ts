import { useState, useEffect } from 'react'
import { authService } from '@/lib/service/auth-service'

export function useAuth() {
  const [user, setUser] = useState(authService.getUserInfo())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (authService.getAuthTokens()) {
          const userInfo = await authService.getCurrentUser()
          setUser(userInfo)
        }
      } catch (error) {
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [])

  return { user, isLoading }
}