import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns initial value immediately', () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 400)
    expect(debounced.value).toBe('hello')
  })

  it('does not update before delay', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 400)
    source.value = 'world'
    await nextTick()
    vi.advanceTimersByTime(399)
    await nextTick()
    expect(debounced.value).toBe('hello')
  })

  it('updates after delay', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 400)
    source.value = 'world'
    await nextTick()
    vi.advanceTimersByTime(400)
    await nextTick()
    expect(debounced.value).toBe('world')
  })

  it('only fires once for rapid changes', async () => {
    const source = ref('a')
    const debounced = useDebounce(source, 400)
    source.value = 'b'
    await nextTick()
    source.value = 'c'
    await nextTick()
    source.value = 'd'
    await nextTick()
    vi.advanceTimersByTime(400)
    await nextTick()
    expect(debounced.value).toBe('d')
  })
})
