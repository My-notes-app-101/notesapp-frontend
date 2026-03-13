import { useUiStore } from '@/stores/ui.store'
import type { Toast } from '@/stores/ui.store'

export function useToast() {
  const uiStore = useUiStore()

  function success(message: string, duration?: number) {
    uiStore.addToast(message, 'success', duration)
  }

  function error(message: string, duration?: number) {
    uiStore.addToast(message, 'error', duration)
  }

  function info(message: string, duration?: number) {
    uiStore.addToast(message, 'info', duration)
  }

  function remove(id: string) {
    uiStore.removeToast(id)
  }

  return {
    success,
    error,
    info,
    remove,
    toasts: uiStore.toasts as Toast[],
  }
}
