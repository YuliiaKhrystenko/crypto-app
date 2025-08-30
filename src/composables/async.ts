// src/composables/async.ts
import { ref, reactive } from 'vue'

export function useAsyncState<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  opts: { onError?: (e: unknown) => void } = {}
) {
  const pending = ref(false)
  const error = ref<unknown | null>(null)

  async function run(...args: TArgs): Promise<TResult> {
    pending.value = true
    error.value = null
    try {
      return await fn(...args)
    } catch (e) {
      error.value = e
      opts.onError?.(e)
      throw e
    } finally {
      pending.value = false
    }
  }

  return { pending, error, run }
}

export function useAsyncByKey<TKey extends string | number>(
  opts: { onError?: (e: unknown) => void } = {}
) {
  const flags = reactive<Record<string, boolean>>({})

  const isPending = (key: TKey): boolean => !!flags[String(key)]

  async function run<T>(key: TKey, job: () => Promise<T>): Promise<T> {
    const k = String(key)
    flags[k] = true
    try {
      return await job()
    } catch (e) {
      opts.onError?.(e)
      throw e
    } finally {
      flags[k] = false
    }
  }

  return { isPending, run, flags }
}
