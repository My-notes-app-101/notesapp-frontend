export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: AppError }

export interface AppError {
  code: 'NETWORK' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'SERVER' | 'UNKNOWN'
  message: string
  fieldErrors?: Record<string, string>
}

export interface PaginatedResponse<T> {
  notes: T[]
  total: number
  page: number
  pageSize: number
}
