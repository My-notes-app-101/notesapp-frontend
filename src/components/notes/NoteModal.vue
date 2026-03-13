<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useNotesStore } from '@/stores/notes.store'
import { CreateNoteSchema, UpdateNoteSchema } from '@/schemas/note.schema'
import { formatDate } from '@/utils/date'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import type { Note } from '@/types/note.types'

interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  note?: Note
}

const props = withDefaults(defineProps<Props>(), {
  note: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const notesStore = useNotesStore()

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(props.mode === 'create' ? CreateNoteSchema : UpdateNoteSchema),
})

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return

    if (props.mode === 'edit' && props.note) {
      setValues({
        title: props.note.title,
        content: props.note.content ?? '',
      })
    } else {
      // always reset to empty when creating
      resetForm({
        values: {
          title: '',
          content: '',
        },
      })
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  let success = false

  if (props.mode === 'create') {
    success = await notesStore.createNote({
      title: values.title,
      content: values.content,
    })
  } else if (props.mode === 'edit' && props.note) {
    success = await notesStore.updateNote(props.note.id, {
      title: values.title,
      content: values.content,
    })
  }

  if (success) {
    emit('success')
    emit('update:modelValue', false)
  }
})
</script>

<template>
  <AppModal
    :model-value="props.modelValue"
    :title="props.mode === 'create' ? 'New note' : 'Edit note'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-stone-900">
          {{ props.mode === 'create' ? 'New note' : 'Edit note' }}
        </h2>
        <button
          class="rounded-lg p-1 text-stone-400 hover:text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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

      <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
        <AppInput name="title" label="Title" placeholder="Note title" autocomplete="off" />
        <AppTextarea name="content" label="Content" placeholder="Write your note here…" :rows="6" />

        <div
          v-if="props.mode === 'edit' && props.note"
          class="flex flex-col gap-0.5 text-xs text-stone-400"
        >
          <span>Created: {{ formatDate(props.note.createdAt) }}</span>
          <span>Updated: {{ formatDate(props.note.updatedAt) }}</span>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <AppButton variant="ghost" type="button" @click="emit('update:modelValue', false)">
            Cancel
          </AppButton>
          <AppButton variant="primary" type="submit" :loading="isSubmitting">
            {{ props.mode === 'create' ? 'Create note' : 'Save changes' }}
          </AppButton>
        </div>
      </form>
    </div>
  </AppModal>
</template>
