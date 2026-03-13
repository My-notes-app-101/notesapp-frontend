<script setup lang="ts">
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { formatDate } from '@/utils/date'
import type { Note } from '@/types/note.types'

interface Props {
  modelValue: boolean
  note: Note | undefined
}

const props = withDefaults(defineProps<Props>(), {
  note: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  edit: [note: Note]
}>()

function handleEdit() {
  if (props.note) {
    emit('edit', props.note)
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <AppModal
    :model-value="props.modelValue"
    :title="props.note?.title ?? ''"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="props.note" class="flex flex-col gap-4">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <h2 class="text-xl font-semibold text-stone-900 leading-snug">
          {{ props.note.title }}
        </h2>
        <button
          class="shrink-0 rounded-lg p-1 text-stone-400 hover:text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Close modal"
          @click="emit('update:modelValue', false)"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="min-h-[120px] rounded-xl bg-stone-50 p-4">
        <p
          v-if="props.note.content"
          class="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap"
        >
          {{ props.note.content }}
        </p>
        <p v-else class="text-sm text-stone-400 italic">No content</p>
      </div>

      <!-- Timestamps -->
      <div class="flex flex-col gap-1 border-t border-stone-100 pt-3">
        <p class="text-xs text-stone-400">
          Created: <span class="text-stone-500">{{ formatDate(props.note.createdAt) }}</span>
        </p>
        <p class="text-xs text-stone-400">
          Updated: <span class="text-stone-500">{{ formatDate(props.note.updatedAt) }}</span>
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2">
        <AppButton variant="ghost" @click="emit('update:modelValue', false)"> Close </AppButton>
        <AppButton variant="primary" @click="handleEdit">
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit note
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
