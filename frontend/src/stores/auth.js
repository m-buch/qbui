import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      router.push('/login')
    }
  }

  return {
    logout,
  }
})
