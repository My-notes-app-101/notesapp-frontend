import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notesApi } from '@/api/notes.api'
import { useUiStore } from '@/stores/ui.store'
import type { Note, CreateNotePayload, UpdateNotePayload } from '@/types/note.types'
import type { AppError } from '@/types/api.types'

export const useNotesStore = defineStore('notes', () => {
  const allNotes = ref<Note[]>([])
  const page = ref(1)
  const pageSize = ref(10)
  const search = ref('')
  const sortBy = ref<'title' | 'createdAt' | 'updatedAt'>('updatedAt')
  const sortDir = ref<'asc' | 'desc'>('desc')
  const status = ref<'idle' | 'loading' | 'error'>('idle')
  const operationStatus = ref<Record<string, 'loading' | 'error' | undefined>>({})
  const error = ref<AppError | null>(null)

  const filteredNotes = computed(() => {
    let result = [...allNotes.value]

    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || (n.content ?? '').toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let valA = ''
      let valB = ''
      if (sortBy.value === 'title') {
        valA = a.title.toLowerCase()
        valB = b.title.toLowerCase()
      } else if (sortBy.value === 'createdAt') {
        valA = a.createdAt
        valB = b.createdAt
      } else {
        valA = a.updatedAt
        valB = b.updatedAt
      }
      if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
      if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
      return 0
    })

    return result
  })

  const total = computed(() => filteredNotes.value.length)

  const notes = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredNotes.value.slice(start, start + pageSize.value)
  })

  async function fetchAllFromApi() {
    const result = await notesApi.fetchNotes({
      page: 1,
      pageSize: 1000,
    })
    if (result.ok) {
      allNotes.value = result.data.notes ?? []
    }
    return result
  }

  async function fetchNotes() {
    const uiStore = useUiStore()
    status.value = 'loading'
    error.value = null

    const result = await fetchAllFromApi()

    if (!result.ok) {
      status.value = 'error'
      error.value = result.error
      uiStore.addToast(result.error.message, 'error')
      return
    }

    status.value = 'idle'
  }

  async function createNote(payload: CreateNotePayload) {
    const uiStore = useUiStore()
    const result = await notesApi.createNote(payload)
    if (!result.ok) {
      uiStore.addToast(result.error.message, 'error')
      return false
    }
    await fetchAllFromApi()
    uiStore.addToast('Note created successfully', 'success')
    return true
  }

  async function updateNote(id: string, patch: UpdateNotePayload) {
    const uiStore = useUiStore()
    operationStatus.value[id] = 'loading'

    const result = await notesApi.updateNote(id, patch)

    if (!result.ok) {
      operationStatus.value[id] = 'error'
      uiStore.addToast(result.error.message, 'error')
      return false
    }

    // refetch from API to stay in sync
    await fetchAllFromApi()
    operationStatus.value[id] = undefined
    uiStore.addToast('Note updated successfully', 'success')
    return true
  }

  async function deleteNote(id: string) {
    const uiStore = useUiStore()
    const index = allNotes.value.findIndex((n) => n.id === id)
    if (index === -1) return false

    const original = [...allNotes.value]
    operationStatus.value[id] = 'loading'

    // optimistic remove
    allNotes.value.splice(index, 1)

    const result = await notesApi.deleteNote(id)

    if (!result.ok) {
      allNotes.value = original
      operationStatus.value[id] = 'error'
      uiStore.addToast(result.error.message, 'error')
      return false
    }

    operationStatus.value[id] = undefined
    uiStore.addToast('Note deleted', 'success')
    return true
  }

  return {
    notes,
    allNotes,
    total,
    page,
    pageSize,
    search,
    sortBy,
    sortDir,
    status,
    operationStatus,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  }
})
