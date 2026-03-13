<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { computed } from 'vue'

const uiStore = useUiStore()

const isOpen = computed(() => uiStore.confirmDialog !== null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') uiStore.closeConfirm(true)
  if (e.key === 'Escape') uiStore.closeConfirm(false)
}
</script>

<template>
  <AppModal :model-value="isOpen" persistent title="Confirm action" @keydown="onKeydown">
    <div v-if="uiStore.confirmDialog" class="flex flex-col gap-4">
      <div>
        <h2 class="text-lg font-semibold text-stone-900">
          {{ uiStore.confirmDialog.title }}
        </h2>
        <p class="mt-1 text-sm text-stone-500">
          {{ uiStore.confirmDialog.message }}
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <AppButton variant="ghost" @click="uiStore.closeConfirm(false)">
          {{ uiStore.confirmDialog.cancelLabel ?? 'Cancel' }}
        </AppButton>
        <AppButton variant="danger" @click="uiStore.closeConfirm(true)">
          {{ uiStore.confirmDialog.confirmLabel ?? 'Confirm' }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
