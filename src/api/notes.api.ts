import http from '@/api/http'
import type { ApiResult, AppError, PaginatedResponse } from '@/types/api.types'
import type {
  Note,
  CreateNotePayload,
  UpdateNotePayload,
  FetchNotesParams,
} from '@/types/note.types'

export const notesApi = {
  async fetchNotes(params?: FetchNotesParams): Promise<ApiResult<PaginatedResponse<Note>>> {
    try {
      const response = await http.get<PaginatedResponse<Note>>('/api/notes', { params })
      return { ok: true, data: response.data }
    } catch (e) {
      return { ok: false, error: e as AppError }
    }
  },

  async getNote(id: string): Promise<ApiResult<Note>> {
    try {
      const response = await http.get<Note>(`/api/notes/${id}`)
      return { ok: true, data: response.data }
    } catch (e) {
      return { ok: false, error: e as AppError }
    }
  },

  async createNote(payload: CreateNotePayload): Promise<ApiResult<Note>> {
    try {
      const response = await http.post<Note>('/api/notes', payload)
      return { ok: true, data: response.data }
    } catch (e) {
      return { ok: false, error: e as AppError }
    }
  },

  async updateNote(id: string, payload: UpdateNotePayload): Promise<ApiResult<Note>> {
    try {
      const response = await http.put<Note>(`/api/notes/${id}`, payload)
      return { ok: true, data: response.data }
    } catch (e) {
      return { ok: false, error: e as AppError }
    }
  },

  async deleteNote(id: string): Promise<ApiResult<void>> {
    try {
      await http.delete(`/api/notes/${id}`)
      return { ok: true, data: undefined }
    } catch (e) {
      return { ok: false, error: e as AppError }
    }
  },
}
