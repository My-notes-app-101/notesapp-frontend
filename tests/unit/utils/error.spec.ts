import { describe, it, expect } from 'vitest'
import { normalizeError } from '@/utils/error'
import axios from 'axios'

function makeAxiosError(status: number, data: unknown = {}) {
  const error = new axios.AxiosError('error')
  error.response = {
    status,
    data,
    headers: {},
    config: {} as never,
    statusText: '',
  }
  return error
}

describe('normalizeError', () => {
  it('maps 400 to VALIDATION with json message', () => {
    const result = normalizeError(makeAxiosError(400, { message: 'Bad input' }))
    expect(result.code).toBe('VALIDATION')
    expect(result.message).toBe('Bad input')
  })

  it('maps 400 to VALIDATION with plain string body', () => {
    const result = normalizeError(makeAxiosError(400, 'Email exists'))
    expect(result.code).toBe('VALIDATION')
    expect(result.message).toBe('Email exists')
  })

  it('maps 401 to UNAUTHORIZED with session message by default', () => {
    const result = normalizeError(makeAxiosError(401))
    expect(result.code).toBe('UNAUTHORIZED')
    expect(result.message).toBe('Your session has expired. Please log in again.')
  })

  it('maps 401 to UNAUTHORIZED with auth context message', () => {
    const result = normalizeError(makeAxiosError(401, 'Invalid credentials'), 'auth')
    expect(result.code).toBe('UNAUTHORIZED')
    expect(result.message).toBe('Invalid credentials')
  })

  it('maps 403 to FORBIDDEN', () => {
    const result = normalizeError(makeAxiosError(403))
    expect(result.code).toBe('FORBIDDEN')
  })

  it('maps 404 to NOT_FOUND', () => {
    const result = normalizeError(makeAxiosError(404))
    expect(result.code).toBe('NOT_FOUND')
  })

  it('maps 409 to VALIDATION', () => {
    const result = normalizeError(makeAxiosError(409, 'Email already exists'))
    expect(result.code).toBe('VALIDATION')
    expect(result.message).toBe('Email already exists')
  })

  it('maps 422 to VALIDATION with fieldErrors', () => {
    const result = normalizeError(
      makeAxiosError(422, {
        message: 'Validation failed',
        errors: { email: 'Invalid email' },
      })
    )
    expect(result.code).toBe('VALIDATION')
    expect(result.fieldErrors).toEqual({ email: 'Invalid email' })
  })

  it('maps 500 to SERVER', () => {
    const result = normalizeError(makeAxiosError(500))
    expect(result.code).toBe('SERVER')
  })

  it('maps network error to NETWORK', () => {
    const error = new axios.AxiosError('Network Error')
    error.response = undefined
    const result = normalizeError(error)
    expect(result.code).toBe('NETWORK')
  })

  it('handles plain Error', () => {
    const result = normalizeError(new Error('something went wrong'))
    expect(result.code).toBe('UNKNOWN')
    expect(result.message).toBe('something went wrong')
  })

  it('handles string throws', () => {
    const result = normalizeError('some string error')
    expect(result.code).toBe('UNKNOWN')
  })
})
