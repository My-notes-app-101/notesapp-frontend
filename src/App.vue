<script setup lang="ts">
import AppToast from '@/components/ui/AppToast.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
</script>

<template>
  <RouterView />
  <AppToast />
  <ConfirmDialog />
</template>
