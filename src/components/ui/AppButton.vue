<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-label="props.ariaLabel"
    :aria-busy="props.loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500':
          props.variant === 'primary',
        'bg-transparent text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-400':
          props.variant === 'ghost',
        'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500':
          props.variant === 'danger',
      },
    ]"
  >
    <svg
      v-if="props.loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
