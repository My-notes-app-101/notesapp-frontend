import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (!to.meta.requiresAuth && authStore.isAuthenticated) {
    return { name: 'notes' }
  }
})

export default router
