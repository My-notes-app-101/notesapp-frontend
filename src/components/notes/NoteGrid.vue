<script setup lang="ts">
import NoteCard from '@/components/notes/NoteCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import NoteEmptyState from '@/components/notes/NoteEmptyState.vue'
import { useNotesStore } from '@/stores/notes.store'
import type { Note } from '@/types/note.types'

const emit = defineEmits<{
  edit: [note: Note]
  view: [note: Note]
}>()

const notesStore = useNotesStore()
</script>

<template>
  <div>
    <div
      v-if="notesStore.status === 'loading' && notesStore.notes.length === 0"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading notes"
    >
      <SkeletonCard v-for="i in 6" :key="i" />
    </div>

    <NoteEmptyState
      v-else-if="notesStore.status === 'idle' && notesStore.notes.length === 0"
      :is-filtered="notesStore.search.length > 0"
    />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NoteCard
        v-for="note in notesStore.notes"
        :key="note.id"
        :note="note"
        @edit="emit('edit', $event)"
        @view="emit('view', $event)"
      />
    </div>
  </div>
</template>
