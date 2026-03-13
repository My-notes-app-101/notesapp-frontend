import { computed } from 'vue'
import { useNotesStore } from '@/stores/notes.store'

export function useNotesFilter() {
  const notesStore = useNotesStore()

  const totalPages = computed(() => Math.ceil(notesStore.total / notesStore.pageSize))

  function setSortBy(value: 'title' | 'createdAt' | 'updatedAt') {
    notesStore.sortBy = value
    notesStore.page = 1
    notesStore.fetchNotes()
  }

  function toggleSortDir() {
    notesStore.sortDir = notesStore.sortDir === 'asc' ? 'desc' : 'asc'
    notesStore.page = 1
    notesStore.fetchNotes()
  }

  function setPage(p: number) {
    notesStore.page = p
    notesStore.fetchNotes()
  }

  return {
    search: computed(() => notesStore.search),
    sortBy: computed(() => notesStore.sortBy),
    sortDir: computed(() => notesStore.sortDir),
    page: computed(() => notesStore.page),
    pageSize: computed(() => notesStore.pageSize),
    total: computed(() => notesStore.total),
    totalPages,
    setSortBy,
    toggleSortDir,
    setPage,
  }
}
