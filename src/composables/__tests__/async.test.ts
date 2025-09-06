// src/composables/__tests__/async.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useAsyncState, useAsyncByKey } from '../../composables/async'

describe('useAsyncState', () => {
  it('handles pending and errors', async () => {
    const ok = vi.fn().mockResolvedValue('ok')
    const { pending, run } = useAsyncState(ok)
    expect(pending.value).toBe(false)
    await expect(run()).resolves.toBe('ok')
    expect(pending.value).toBe(false)

    const boom = vi.fn().mockRejectedValue(new Error('fail'))
    const { pending: p2, run: r2 } = useAsyncState(boom)
    await expect(r2()).rejects.toThrow('fail')
    expect(p2.value).toBe(false)
  })
})

describe('useAsyncByKey', () => {
  it('keeps per-key pending flags', async () => {
    const { isPending, run } = useAsyncByKey<string>()
    const job = vi.fn().mockResolvedValue(1)

    const p = run('a', job)
    expect(isPending('a')).toBe(true)
    await p
    expect(isPending('a')).toBe(false)
  })
})
