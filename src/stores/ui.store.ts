import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
}

export interface ConfirmDialogState {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  resolve: (value: boolean) => void
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const confirmDialog = ref<ConfirmDialogState | null>(null)
  const activeModal = ref<string | null>(null)

  function addToast(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const id = crypto.randomUUID()
    toasts.value.push({ id, message, type, duration })
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function openConfirm(options: Omit<ConfirmDialogState, 'resolve'>): Promise<boolean> {
    return new Promise((resolve) => {
      confirmDialog.value = { ...options, resolve }
    })
  }

  function closeConfirm(value: boolean) {
    if (confirmDialog.value) {
      confirmDialog.value.resolve(value)
      confirmDialog.value = null
    }
  }

  function openModal(name: string) {
    activeModal.value = name
  }

  function closeModal() {
    activeModal.value = null
  }

  return {
    toasts,
    confirmDialog,
    activeModal,
    addToast,
    removeToast,
    openConfirm,
    closeConfirm,
    openModal,
    closeModal,
  }
})
