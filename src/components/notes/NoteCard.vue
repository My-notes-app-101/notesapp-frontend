<script setup lang="ts">
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notes.store'
import { useUiStore } from '@/stores/ui.store'
import { formatDateShort } from '@/utils/date'
import AppButton from '@/components/ui/AppButton.vue'
import type { Note } from '@/types/note.types'

interface Props {
  note: Note
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [note: Note]
  view: [note: Note]
}>()

const notesStore = useNotesStore()
const uiStore = useUiStore()

const isDeleting = computed(() => notesStore.operationStatus[props.note.id] === 'loading')

const contentPreview = computed(() => {
  if (!props.note.content) return null
  return props.note.content.length > 120
    ? props.note.content.slice(0, 120) + '…'
    : props.note.content
})

async function handleDelete() {
  const confirmed = await uiStore.openConfirm({
    title: 'Delete note',
    message: `Are you sure you want to delete "${props.note.title}"? This cannot be undone.`,
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  })
  if (confirmed) {
    await notesStore.deleteNote(props.note.id)
  }
}
</script>

<template>
  <article
    class="group flex flex-col gap-3 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-stone-200 cursor-pointer"
    :aria-label="`Note: ${props.note.title}`"
    role="article"
    @click="emit('view', props.note)"
  >
    <div class="flex-1">
      <h3 class="font-semibold text-stone-900 leading-snug line-clamp-2">
        {{ props.note.title }}
      </h3>
      <p v-if="contentPreview" class="mt-2 text-sm text-stone-500 leading-relaxed line-clamp-3">
        {{ contentPreview }}
      </p>
      <p v-else class="mt-2 text-sm text-stone-400 italic">No content</p>
    </div>

    <div class="flex items-center justify-between pt-1 border-t border-stone-50" @click.stop>
      <time :datetime="props.note.updatedAt" class="text-xs text-stone-400">
        {{ formatDateShort(props.note.updatedAt) }}
      </time>

      <div class="flex items-center gap-1">
        <AppButton
          variant="ghost"
          :disabled="isDeleting"
          aria-label="Edit note"
          class="!px-2 !py-1 text-xs"
          @click="emit('edit', props.note)"
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </AppButton>
        <AppButton
          variant="danger"
          :disabled="isDeleting"
          :loading="isDeleting"
          aria-label="Delete note"
          class="!px-2 !py-1 text-xs"
          @click="handleDelete"
        >
          <svg
            v-if="!isDeleting"
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </AppButton>
      </div>
    </div>
  </article>
</template>
