import http from '@/api/http'
import type { ApiResult, AppError } from '@/types/api.types'
import type { LoginPayload, RegisterPayload, LoginResponse } from '@/types/auth.types'
import { normalizeError } from '@/utils/error'

export const authApi = {
  async login(payload: LoginPayload): Promise<ApiResult<LoginResponse>> {
    try {
      const response = await http.post<LoginResponse>('/api/auth/login', payload)
      return { ok: true, data: response.data }
    } catch (e) {
      return { ok: false, error: normalizeError(e, 'auth') as AppError }
    }
  },

  async register(payload: RegisterPayload): Promise<ApiResult<LoginResponse>> {
    try {
      const response = await http.post<LoginResponse>('/api/auth/register', payload)
      return { ok: true, data: response.data }
    } catch (e) {
      return { ok: false, error: normalizeError(e, 'auth') as AppError }
    }
  },
}
