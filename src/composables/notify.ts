// src/composables/notify.ts
import { useMessage } from 'naive-ui'

export function useNotify() {
  const m = useMessage()
  const err = (e: unknown, fallback = 'Error') =>
    m.error(typeof e === 'string' ? e : (e as Error)?.message || fallback)

  return {
    success: (t: string) => m.success(t),
    info:    (t: string) => m.info(t),
    warn:    (t: string) => m.warning(t),
    error:   err,
  }
}
