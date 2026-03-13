<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { LoginSchema } from '@/schemas/auth.schema'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
})

const onSubmit = handleSubmit(async (values) => {
  const success = await authStore.login({
    email: values.email,
    password: values.password,
  })
  if (success) router.push({ name: 'notes' })
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-stone-50 px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <div
          class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg"
        >
          <svg
            class="h-7 w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-stone-900">Welcome back</h1>
        <p class="mt-1 text-sm text-stone-500">Sign in to your notes</p>
      </div>

      <div class="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
        <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
          <AppInput
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
          <AppInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <AppButton type="submit" variant="primary" :loading="isSubmitting" class="mt-1 w-full">
            Sign in
          </AppButton>
        </form>
      </div>

      <p class="mt-4 text-center text-sm text-stone-500">
        Don't have an account?
        <router-link
          :to="{ name: 'register' }"
          class="font-medium text-emerald-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
        >
          Sign up
        </router-link>
      </p>
    </div>
  </div>
</template>
