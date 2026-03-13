<script setup lang="ts">
import { useNotesStore } from '../../stores/notes.store'

const notesStore = useNotesStore()

function setSortBy(value: 'title' | 'createdAt' | 'updatedAt') {
  notesStore.sortBy = value
  notesStore.page = 1
}

function toggleSortDir() {
  notesStore.sortDir = notesStore.sortDir === 'asc' ? 'desc' : 'asc'
  notesStore.page = 1
}
</script>

<template>
  <div class="flex items-center gap-2">
    <select
      :value="notesStore.sortBy"
      class="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      aria-label="Sort by"
      @change="
        setSortBy(($event.target as HTMLSelectElement).value as 'title' | 'createdAt' | 'updatedAt')
      "
    >
      <option value="updatedAt">Last updated</option>
      <option value="createdAt">Created</option>
      <option value="title">Title</option>
    </select>
    <button
      class="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      :aria-label="`Sort direction: ${notesStore.sortDir === 'asc' ? 'ascending' : 'descending'}`"
      @click="toggleSortDir"
    >
      <svg
        class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': notesStore.sortDir === 'asc' }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      {{ notesStore.sortDir === 'asc' ? 'Asc' : 'Desc' }}
    </button>
  </div>
</template>
