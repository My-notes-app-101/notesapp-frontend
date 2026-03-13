<script setup lang="ts">
interface Props {
  isFiltered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFiltered: false,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
      <svg
        class="h-10 w-10 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-stone-800">
      {{ props.isFiltered ? 'No notes found' : 'No notes yet' }}
    </h3>
    <p class="mt-1 text-sm text-stone-500">
      {{
        props.isFiltered
          ? 'Try adjusting your search or filters.'
          : 'Create your first note to get started.'
      }}
    </p>
  </div>
</template>
