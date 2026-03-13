import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debounced = ref<T>(value.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(value, (newValue) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = newValue
    }, delay)
  })

  return debounced
}
