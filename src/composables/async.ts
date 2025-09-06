// src/composables/async.ts
import { ref, reactive } from 'vue'

export function useAsyncState<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  opts: { onError?: (e: unknown) => void } = {}
) {
  const pending = ref(false)
  const error = ref<unknown | null>(null)

  async function run(...args: TArgs): Promise<TResult> {
    if (pending.value) {
      return await new Promise((resolve, reject) =>
        queueMicrotask(() => (pending.value ? reject(new Error('Busy')) : resolve(fn(...args))))
      )
    }
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

type Key = string | number

export function useAsyncByKey<TKey extends Key>(
  opts: { onError?: (e: unknown) => void } = {}
) {
  const flags = reactive<Record<Key, boolean>>({})
  const errors = reactive<Record<Key, unknown>>({})

  const asKey = (k: TKey): Key => (typeof k === 'number' ? k : String(k))

  const isPending = (key: TKey): boolean => !!flags[asKey(key)]

  async function run<T>(key: TKey, job: () => Promise<T>): Promise<T> {
    const k = asKey(key)
    if (flags[k]) return Promise.reject(new Error('Busy')) 

    flags[k] = true
    errors[k] = null
    try {
      return await job()
    } catch (e) {
      errors[k] = e
      opts.onError?.(e)
      throw e
    } finally {
      flags[k] = false
    }
  }

  return { isPending, run, flags, errors }
}
