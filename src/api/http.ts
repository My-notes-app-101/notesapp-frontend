import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { normalizeError } from '@/utils/error'
import router from '@/router'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const isAuthRoute =
      axios.isAxiosError(error) &&
      (error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register'))

    // let auth routes handle their own errors with proper context
    if (isAuthRoute) {
      return Promise.reject(error)
    }

    const normalized = normalizeError(error)

    if (normalized.code === 'UNAUTHORIZED') {
      const authStore = useAuthStore()
      authStore.logout()
      router.push({ name: 'login' })
    }

    return Promise.reject(normalized)
  }
)

export default http
