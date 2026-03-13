<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui.store'
import type { Toast } from '@/stores/ui.store'

const uiStore = useUiStore()
const timers = new Map<string, ReturnType<typeof setTimeout>>()

function schedule(toast: Toast) {
  if (timers.has(toast.id)) return
  const t = setTimeout(() => uiStore.removeToast(toast.id), toast.duration)
  timers.set(toast.id, t)
}

function dismiss(id: string) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  uiStore.removeToast(id)
}

onUnmounted(() => timers.forEach((t) => clearTimeout(t)))
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
    aria-live="polite"
    aria-label="Notifications"
  >
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        :ref="() => schedule(toast)"
        :class="[
          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg min-w-[280px] max-w-sm',
          {
            'bg-emerald-500 text-white': toast.type === 'success',
            'bg-red-500 text-white': toast.type === 'error',
            'bg-stone-800 text-white': toast.type === 'info',
          },
        ]"
        role="alert"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button
          class="ml-auto opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          aria-label="Dismiss notification"
          @click="dismiss(toast.id)"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
