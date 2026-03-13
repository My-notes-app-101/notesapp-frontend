import type { AppError } from '@/types/api.types'
import axios from 'axios'

function extractMessage(data: unknown): string | undefined {
  if (typeof data === 'string' && data.length > 0) return data
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.title === 'string') return obj.title
  }
  return undefined
}

export function normalizeError(e: unknown, context?: 'auth'): AppError {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status
    const serverMessage = extractMessage(e.response?.data)

    if (!e.response) {
      return {
        code: 'NETWORK',
        message: 'Network error. Please check your connection.',
      }
    }

    if (status === 400) {
      return {
        code: 'VALIDATION',
        message: serverMessage ?? 'Invalid request. Please check your input.',
      }
    }

    if (status === 401) {
      if (context === 'auth') {
        return {
          code: 'UNAUTHORIZED',
          message: serverMessage ?? 'Invalid email or password.',
        }
      }
      return {
        code: 'UNAUTHORIZED',
        message: 'Your session has expired. Please log in again.',
      }
    }

    if (status === 403) {
      return {
        code: 'FORBIDDEN',
        message: serverMessage ?? 'You do not have permission to perform this action.',
      }
    }

    if (status === 404) {
      return {
        code: 'NOT_FOUND',
        message: serverMessage ?? 'The requested resource was not found.',
      }
    }

    if (status === 409) {
      return {
        code: 'VALIDATION',
        message: serverMessage ?? 'An account with this email already exists.',
      }
    }

    if (status === 422) {
      const rawErrors = e.response.data?.errors as Record<string, string> | undefined
      return {
        code: 'VALIDATION',
        message: serverMessage ?? 'Validation failed.',
        fieldErrors: rawErrors,
      }
    }

    if (status !== undefined && status >= 500) {
      return {
        code: 'SERVER',
        message: serverMessage ?? 'Server error. Please try again later.',
      }
    }

    return {
      code: 'UNKNOWN',
      message: serverMessage ?? 'An unexpected error occurred.',
    }
  }

  if (e instanceof Error) {
    return {
      code: 'UNKNOWN',
      message: e.message,
    }
  }

  return {
    code: 'UNKNOWN',
    message: 'An unexpected error occurred.',
  }
}
