<script setup lang="ts">
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notes.store'
import AppButton from '@/components/ui/AppButton.vue'

const notesStore = useNotesStore()
const totalPages = computed(() => Math.ceil(notesStore.total / notesStore.pageSize))
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-3">
    <AppButton
      variant="ghost"
      :disabled="notesStore.page === 1"
      aria-label="Previous page"
      @click="notesStore.page--"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Prev
    </AppButton>
    <span class="text-sm text-stone-500">
      Page <span class="font-semibold text-stone-800">{{ notesStore.page }}</span> of
      <span class="font-semibold text-stone-800">{{ totalPages }}</span>
    </span>
    <AppButton
      variant="ghost"
      :disabled="notesStore.page === totalPages"
      aria-label="Next page"
      @click="notesStore.page++"
    >
      Next
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </AppButton>
  </div>
</template>
