// src/stores/__tests__/dca.store.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDcaStore, ConcurrencyError } from '../dca'
import { getDB, STORE, clearDB, __resetDBForTests__ } from '../dca.db'
import type { DcaPlan, DcaPlanInput } from '../../types/dca'

const baseInput: DcaPlanInput = {
  asset: 'BTC',
  amount: 250,
  period: 'weekly',
  startDate: '2024-01-01',
  feePct: 0.5,
  feeFlat: 1,
}

function mockNowSequence(...values: number[]) {
  const spy = vi.spyOn(Date, 'now')
  for (const v of values) spy.mockReturnValueOnce(v)
  return spy
}

beforeEach(async () => {
  setActivePinia(createPinia())

  __resetDBForTests__()
  await clearDB()

  vi.restoreAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('DCA store', () => {
  it('init()', async () => {
    const d = await getDB()
    const now = 1000
    const plan: DcaPlan = {
      id: 'p1',
      asset: 'ETH',
      amount: 100,
      period: 'monthly',
      startDate: '2024-02-01',
      feePct: 0,
      feeFlat: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    }
    await d.put(STORE, plan)

    const s = useDcaStore()
    expect(s.isReady).toBe(false)

    await s.init()
    expect(s.isReady).toBe(true)
    expect(s.plans).toHaveLength(1)
    expect(s.planById('p1')).toEqual(plan)

    await s.init()
    expect(s.plans).toHaveLength(1)
  })

  it('addPlan()', async () => {
    const s = useDcaStore()
    await s.init()

    const t = mockNowSequence(2000, 2000)

    const id = await s.addPlan({ ...baseInput, active: undefined })
    const added = s.planById(id)!

    expect(added.asset).toBe('BTC')
    expect(added.active).toBe(true)
    expect(added.createdAt).toBe(2000)
    expect(added.updatedAt).toBe(2000)

    const d = await getDB()
    expect(await d.get(STORE, id)).toEqual(added)

    t.mockRestore()
  })

  it('updatePlan()', async () => {
    const s = useDcaStore()
    await s.init()

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(3000)
    const id = await s.addPlan(baseInput)

    const before = s.planById(id)!

    nowSpy.mockReturnValue(5000)
    await s.updatePlan(id, { amount: 120 })

    const after = s.planById(id)!
    expect(after.amount).toBe(120)
    expect(after.asset).toBe(before.asset)
    expect(after.updatedAt).toBe(5000)

    const d = await getDB()
    expect(await d.get(STORE, id)).toEqual(after)

    nowSpy.mockRestore()
  })

  it('updatePlan()', async () => {
    const s = useDcaStore()
    await s.init()

    const t = mockNowSequence(1000, 1000)
    const id = await s.addPlan(baseInput)
    t.mockRestore()

    const d = await getDB()
    const fresh = (await d.get(STORE, id))!
    fresh.updatedAt = 999_999
    await d.put(STORE, fresh)

    await expect(s.updatePlan(id, { amount: 10 })).rejects.toBeInstanceOf(ConcurrencyError)
  })

  it('toggleActive()', async () => {
    const s = useDcaStore()
    await s.init()

    mockNowSequence(1000, 1000)
    const id = await s.addPlan({ ...baseInput, active: false })

    await s.toggleActive(id)
    const p = s.planById(id)!
    expect(p.active).toBe(true)

    const d = await getDB()
    expect((await d.get(STORE, id))!.active).toBe(true)
  })

  it('removePlan()', async () => {
    const s = useDcaStore()
    await s.init()

    mockNowSequence(1000, 1000)
    const id = await s.addPlan(baseInput)
    expect(s.planById(id)).toBeDefined()

    await s.removePlan(id)
    expect(s.planById(id)).toBeUndefined()

    const d = await getDB()
    expect(await d.get(STORE, id)).toBeUndefined()
  })

  it('setAll()', async () => {
    const s = useDcaStore()
    await s.init()

    const now = 42
    const planA: DcaPlan = {
      id: 'a',
      asset: 'BTC',
      amount: 10,
      period: 'weekly',
      startDate: '2024-01-01',
      feePct: 0,
      feeFlat: 0,
      active: true,
      createdAt: now,
      updatedAt: now,
    }
    const planB: DcaPlan = { ...planA, id: 'b', asset: 'ETH' }

    await s.setAll([planA, planB])
    expect(s.plans.map((p) => p.id).sort()).toEqual(['a', 'b'])

    const d = await getDB()
    expect((await d.getAll(STORE)).map((p) => p.id).sort()).toEqual(['a', 'b'])

    const invalid = { ...planA, amount: -1 } as unknown as DcaPlan
    await expect(s.setAll([invalid])).rejects.toThrow()
  })

  it('getters', async () => {
    const s = useDcaStore()
    await s.init()

    mockNowSequence(1000, 1000)
    const a = await s.addPlan({ ...baseInput, asset: 'BTC', active: true })
    mockNowSequence(2000, 2000)
    const b = await s.addPlan({ ...baseInput, asset: 'ETH', active: false })

    const active = s.activePlans
    expect(active).toHaveLength(1)
    expect(active[0]!.id).toBe(a)

    expect(s.planById(a)?.asset).toBe('BTC')
    expect(s.planById(b)?.asset).toBe('ETH')
    expect(s.planById('missing')).toBeUndefined()
  })

  it('reset()', async () => {
    const s = useDcaStore()
    await s.init()

    mockNowSequence(1000, 1000)
    await s.addPlan(baseInput)
    expect(s.plans).toHaveLength(1)

    await s.reset()
    expect(s.plans).toHaveLength(0)

    const d = await getDB()
    expect(await d.getAll(STORE)).toHaveLength(0)
  })
})
