import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { authService } from '@/lib/service/auth-service';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const tokens = authService.getAuthTokens();
    if (!tokens) {
      router.replace('/login'); // ou outra rota pública
    }
  }, []);
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const item = window.localStorage.getItem(key)
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      console.error(error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}