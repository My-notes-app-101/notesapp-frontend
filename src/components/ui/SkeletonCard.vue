<script setup lang="ts"></script>

<template>
  <div
    class="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm"
    aria-busy="true"
    aria-label="Loading note"
  >
    <div class="animate-pulse space-y-3">
      <div class="h-4 w-3/4 rounded-full bg-stone-200" />
      <div class="h-3 w-full rounded-full bg-stone-100" />
      <div class="h-3 w-5/6 rounded-full bg-stone-100" />
      <div class="h-3 w-4/6 rounded-full bg-stone-100" />
      <div class="mt-4 flex justify-between">
        <div class="h-3 w-20 rounded-full bg-stone-100" />
        <div class="flex gap-2">
          <div class="h-7 w-14 rounded-lg bg-stone-100" />
          <div class="h-7 w-14 rounded-lg bg-stone-100" />
        </div>
      </div>
    </div>
  </div>
</template>
