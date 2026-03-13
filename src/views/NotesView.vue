<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes.store'
import { useAuthStore } from '@/stores/auth.store'
import NoteGrid from '@/components/notes/NoteGrid.vue'
import NoteModal from '@/components/notes/NoteModal.vue'
import NoteDetailModal from '@/components/notes/NoteDetailModal.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import SortControls from '@/components/ui/SortControls.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { Note } from '@/types/note.types'

const router = useRouter()
const notesStore = useNotesStore()
const authStore = useAuthStore()

const showDetailModal = ref(false)
const showEditModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const selectedNote = ref<Note | undefined>(undefined)

onMounted(() => notesStore.fetchNotes())

function openCreate() {
  modalMode.value = 'create'
  selectedNote.value = undefined
  showEditModal.value = true
}

function openEdit(note: Note) {
  modalMode.value = 'edit'
  selectedNote.value = note
  showEditModal.value = true
}

function openDetail(note: Note) {
  selectedNote.value = note
  showDetailModal.value = true
}

async function handleLogout() {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <header class="sticky top-0 z-10 border-b border-stone-100 bg-white/80 backdrop-blur-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <svg
              class="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span class="font-semibold text-stone-900">Notes</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-stone-500 sm:block">
            {{ authStore.user?.username }}
          </span>
          <AppButton variant="ghost" class="!px-2 !py-1 text-xs" @click="handleLogout">
            Sign out
          </AppButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-1 items-center gap-3">
          <div class="flex-1 max-w-sm">
            <SearchBar />
          </div>
          <SortControls />
        </div>
        <AppButton variant="primary" @click="openCreate">
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New note
        </AppButton>
      </div>

      <p
        v-if="notesStore.status === 'idle' && notesStore.total > 0"
        class="mb-4 text-sm text-stone-400"
        aria-live="polite"
      >
        {{ notesStore.total }} {{ notesStore.total === 1 ? 'note' : 'notes' }}
      </p>

      <NoteGrid @edit="openEdit" @view="openDetail" />

      <div class="mt-8">
        <AppPagination />
      </div>
    </main>

    <!-- Detail modal -->
    <NoteDetailModal v-model="showDetailModal" :note="selectedNote" @edit="openEdit" />

    <!-- Create / Edit modal -->
    <NoteModal v-model="showEditModal" :mode="modalMode" :note="selectedNote" />
  </div>
</template>
