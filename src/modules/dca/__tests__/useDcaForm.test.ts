// src/modules/dca/__tests__/useDcaForm.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import type { DcaPlan } from '../../../types/dca'
import type { FormInst } from 'naive-ui'
import { useDcaForm } from '@modules/dca/composables/useDcaForm'

function makePlan(overrides: Partial<DcaPlan> = {}): DcaPlan {
  const now = 1_000
  return {
    id: 'p1',
    asset: 'BTC',
    amount: 10,
    period: 'weekly',
    startDate: '2025-01-01',
    feePct: 1,
    feeFlat: 0,
    active: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

describe('useDcaForm', () => {
  it('syncs initial plan into the form and resets when initial becomes null', async () => {
    const initial = ref<DcaPlan | null>(null)
    const { form, reset } = useDcaForm(initial)

    expect(form.asset).toBe('')
    expect(form.amount).toBe(0)
    expect(form.period).toBe('weekly')
    expect(form.startDate).toBeNull()
    expect(form.active).toBe(true)

    initial.value = makePlan({ asset: 'ETH', amount: 123, startDate: '2025-02-02', active: false })
    await nextTick()

    expect(form.asset).toBe('ETH')
    expect(form.amount).toBe(123)
    expect(form.startDate).toBe('2025-02-02')
    expect(form.active).toBe(false)

    initial.value = null
    await nextTick()

    expect(form.asset).toBe('')
    expect(form.amount).toBe(0)
    expect(form.period).toBe('weekly')
    expect(form.startDate).toBeNull()
    expect(form.active).toBe(true)

    initial.value = makePlan({ asset: 'SOL' })
    await nextTick()
    reset()
    expect(form.asset).toBe('')
    expect(form.startDate).toBeNull()
  })

  it('validateAndBuild() trims asset, validates via Zod, and throws when invalid', async () => {
    const initial = ref<DcaPlan | null>(null)
    const { form, formRef, validateAndBuild } = useDcaForm(initial)

    const mockValidate: FormInst['validate'] = vi.fn().mockResolvedValue(undefined)
    formRef.value = { validate: mockValidate } as unknown as FormInst

    // case 1: invalid (no startDate) -> throws
    form.asset = '  BTC  '
    form.amount = 25
    form.period = 'weekly'
    form.startDate = null
    await expect(validateAndBuild()).rejects.toThrow()

    // case 2: valid -> returns canonical input with trimmed asset
    form.startDate = '2025-01-01'
    const payload = await validateAndBuild()

    expect(payload.asset).toBe('BTC')
    expect(payload.amount).toBe(25)
    expect(payload.period).toBe('weekly')
    expect(payload.startDate).toBe('2025-01-01')
    expect(payload.active).toBe(true)
    expect(payload.feePct).toBe(0)
    expect(payload.feeFlat).toBe(0)

    // ensure UI validate was called
    expect(mockValidate).toHaveBeenCalled()
  })
})
