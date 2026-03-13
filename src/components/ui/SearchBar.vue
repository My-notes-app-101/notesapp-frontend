<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotesStore } from '@/stores/notes.store'

const notesStore = useNotesStore()
const localValue = ref(notesStore.search)
let timer: ReturnType<typeof setTimeout>

watch(localValue, (val) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    notesStore.search = val
    notesStore.page = 1
  }, 400)
})

function clear() {
  localValue.value = ''
  clearTimeout(timer)
  notesStore.search = ''
  notesStore.page = 1
}
</script>

<template>
  <div class="relative flex items-center">
    <svg
      class="absolute left-3 h-4 w-4 text-stone-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
    </svg>
    <input
      v-model="localValue"
      type="search"
      placeholder="Search notes..."
      class="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-9 text-sm text-stone-900 placeholder-stone-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      aria-label="Search notes"
    />
    <button
      v-if="localValue"
      class="absolute right-3 text-stone-400 hover:text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
      aria-label="Clear search"
      @click="clear"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
