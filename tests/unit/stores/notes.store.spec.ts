import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '@/stores/notes.store'
import * as notesApi from '@/api/notes.api'
import type { Note } from '@/types/note.types'

const mockNote: Note = {
  id: '1',
  title: 'Test Note',
  content: 'Test content',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user1',
}

const mockNote2: Note = {
  id: '2',
  title: 'Second Note',
  content: 'Second content',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'user1',
}

vi.mock('@/api/notes.api', () => ({
  notesApi: {
    fetchNotes: vi.fn(),
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
    getNote: vi.fn(),
  },
}))

vi.mock('@/stores/ui.store', () => ({
  useUiStore: () => ({
    addToast: vi.fn(),
  }),
}))

describe('notes.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchNotes', () => {
    it('populates allNotes on success', async () => {
      vi.mocked(notesApi.notesApi.fetchNotes).mockResolvedValue({
        ok: true,
        data: { notes: [mockNote, mockNote2], total: 2, page: 1, pageSize: 1000 },
      })

      const store = useNotesStore()
      await store.fetchNotes()

      expect(store.allNotes).toHaveLength(2)
      expect(store.status).toBe('idle')
    })

    it('sets error status on failure', async () => {
      vi.mocked(notesApi.notesApi.fetchNotes).mockResolvedValue({
        ok: false,
        error: { code: 'SERVER', message: 'Server error' },
      })

      const store = useNotesStore()
      await store.fetchNotes()

      expect(store.status).toBe('error')
      expect(store.allNotes).toHaveLength(0)
    })
  })

  describe('createNote', () => {
    it('appends note and refetches on success', async () => {
      vi.mocked(notesApi.notesApi.createNote).mockResolvedValue({
        ok: true,
        data: mockNote,
      })
      vi.mocked(notesApi.notesApi.fetchNotes).mockResolvedValue({
        ok: true,
        data: { notes: [mockNote], total: 1, page: 1, pageSize: 1000 },
      })

      const store = useNotesStore()
      const result = await store.createNote({ title: 'Test Note', content: 'Test content' })

      expect(result).toBe(true)
      expect(store.allNotes).toHaveLength(1)
    })

    it('returns false on failure', async () => {
      vi.mocked(notesApi.notesApi.createNote).mockResolvedValue({
        ok: false,
        error: { code: 'SERVER', message: 'Server error' },
      })

      const store = useNotesStore()
      const result = await store.createNote({ title: 'Test Note' })

      expect(result).toBe(false)
    })
  })

  describe('deleteNote', () => {
    it('removes note optimistically', async () => {
      vi.mocked(notesApi.notesApi.deleteNote).mockResolvedValue({
        ok: true,
        data: undefined,
      })

      const store = useNotesStore()
      store.allNotes = [mockNote, mockNote2]

      await store.deleteNote('1')

      expect(store.allNotes).toHaveLength(1)
      expect(store.allNotes[0].id).toBe('2')
    })

    it('rolls back on API error', async () => {
      vi.mocked(notesApi.notesApi.deleteNote).mockResolvedValue({
        ok: false,
        error: { code: 'SERVER', message: 'Server error' },
      })

      const store = useNotesStore()
      store.allNotes = [mockNote, mockNote2]

      await store.deleteNote('1')

      expect(store.allNotes).toHaveLength(2)
    })
  })

  describe('updateNote', () => {
    it('refetches after successful update', async () => {
      const updated = { ...mockNote, title: 'Updated Title' }
      vi.mocked(notesApi.notesApi.updateNote).mockResolvedValue({
        ok: true,
        data: updated,
      })
      vi.mocked(notesApi.notesApi.fetchNotes).mockResolvedValue({
        ok: true,
        data: { notes: [updated], total: 1, page: 1, pageSize: 1000 },
      })

      const store = useNotesStore()
      store.allNotes = [mockNote]

      const result = await store.updateNote('1', { title: 'Updated Title' })

      expect(result).toBe(true)
      expect(store.allNotes[0].title).toBe('Updated Title')
    })

    it('returns false on API error', async () => {
      vi.mocked(notesApi.notesApi.updateNote).mockResolvedValue({
        ok: false,
        error: { code: 'SERVER', message: 'Server error' },
      })

      const store = useNotesStore()
      store.allNotes = [mockNote]

      const result = await store.updateNote('1', { title: 'Updated Title' })

      expect(result).toBe(false)
    })
  })
})
