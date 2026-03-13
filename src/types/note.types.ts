export interface Note {
  id: string
  title: string
  content: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateNotePayload {
  title: string
  content?: string
}

export interface UpdateNotePayload {
  title: string
  content?: string
}

export interface FetchNotesParams {
  search?: string
  sortBy?: 'title' | 'createdAt' | 'updatedAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}
