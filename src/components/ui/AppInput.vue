<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'

interface Props {
  name: string
  label: string
  type?: string
  placeholder?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  autocomplete: 'off',
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="props.name" class="text-sm font-medium text-stone-700">
      {{ props.label }}
    </label>
    <Field
      :id="props.name"
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      class="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
    />
    <ErrorMessage :name="props.name" class="text-xs text-red-500" role="alert" />
  </div>
</template>
