import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.api'
import { useUiStore } from '@/stores/ui.store'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth.types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)

    const isAuthenticated = computed(() => token.value !== null)

    async function login(payload: LoginPayload) {
      const uiStore = useUiStore()
      const result = await authApi.login(payload)

      if (!result.ok) {
        uiStore.addToast(result.error.message, 'error')
        return false
      }

      token.value = result.data.token
      user.value = {
        id: result.data.id,
        username: result.data.username,
        email: result.data.email,
      }
      return true
    }

    async function register(payload: RegisterPayload) {
      const uiStore = useUiStore()
      const result = await authApi.register(payload)

      if (!result.ok) {
        uiStore.addToast(result.error.message, 'error')
        return false
      }

      token.value = result.data.token
      user.value = {
        id: result.data.id,
        username: result.data.username,
        email: result.data.email,
      }
      return true
    }

    function logout() {
      token.value = null
      user.value = null
    }

    return {
      token,
      user,
      isAuthenticated,
      login,
      register,
      logout,
    }
  },
  {
    persist: {
      paths: ['token'],
    },
  }
)
