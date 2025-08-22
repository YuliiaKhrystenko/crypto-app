// src/stores/dca.ts
import { defineStore } from 'pinia'
import type { DcaPlan, DcaPlanInput, DcaPlanPatch } from '../types/dca'
import { zDcaPlan, zDcaPlanInput } from '../types/dca'
import { getDB, STORE } from './dca.db'

export class ConcurrencyError extends Error {
  constructor(public planId: string) {
    super('Plan was updated in another tab')
    this.name = 'ConcurrencyError'
  }
}

export const useDcaStore = defineStore('dca', {
  state: () => ({
    isReady: false as boolean,
    plans: [] as DcaPlan[],
  }),

  getters: {
    activePlans: (s) => s.plans.filter(p => p.active),
    planById:    (s) => (id: string) => s.plans.find(p => p.id === id),
  },

  actions: {
    /** Init **/
    async init(): Promise<void> {
      if (this.isReady) return
      try {
        const d = await getDB()
        const rows = await d.getAll(STORE)
        const valid = rows.map(r => zDcaPlan.parse(r))
        this.$patch({ plans: valid, isReady: true })
      } catch (e) {
        console.error('[DCA] init error:', e)
        this.isReady = true
      }
    },

    /** Add Plan */
    async addPlan(input: DcaPlanInput): Promise<string> {
      const parsed = zDcaPlanInput.parse(input)
      const now = Date.now()

      const plan: DcaPlan = {
        ...parsed,
        id: crypto.randomUUID(),
        active: parsed.active ?? true,
        createdAt: now,
        updatedAt: now,
      }

      const d = await getDB()
      await d.put(STORE, plan)

      this.plans = [...this.plans, plan]
      return plan.id
    },

    /** Update Plan **/
    async updatePlan(id: string, patch: DcaPlanPatch): Promise<void> {
      const idx = this.plans.findIndex(p => p.id === id)
      if (idx < 0) throw new Error('Plan not found')

      const current = this.plans[idx]!
      const parsedPatch = zDcaPlanInput.partial().parse(patch)

      const d = await getDB()
      const fresh = await d.get(STORE, id)
      if (fresh && fresh.updatedAt > current.updatedAt) {
        throw new ConcurrencyError(id)
      }

      const updated: DcaPlan = {
        ...current,
        asset:     parsedPatch.asset     ?? current.asset,
        amount:    parsedPatch.amount    ?? current.amount,
        period:    parsedPatch.period    ?? current.period,
        startDate: parsedPatch.startDate ?? current.startDate,
        feePct:    parsedPatch.feePct    ?? current.feePct,
        feeFlat:   parsedPatch.feeFlat   ?? current.feeFlat,
        active:    parsedPatch.active    ?? current.active,
        updatedAt: Date.now(),
      }

      await d.put(STORE, updated)
      this.$patch(s => { s.plans[idx] = updated })
    },

    /** Toggle Active **/
    async toggleActive(id: string): Promise<void> {
      const p = this.planById(id)
      if (!p) throw new Error('Plan not found')
      await this.updatePlan(id, { active: !p.active })
    },

    /** Delete plan **/
    async removePlan(id: string): Promise<void> {
      const d = await getDB()
      await d.delete(STORE, id)
      this.plans = this.plans.filter(p => p.id !== id)
    },

    /** Import/Export **/
    async setAll(plans: DcaPlan[]): Promise<void> {
      const validated = plans.map(p => zDcaPlan.parse(p))

      const d = await getDB()
      const tx = d.transaction(STORE, 'readwrite')
      await tx.store.clear()
      for (const p of validated) await tx.store.put(p)
      await tx.done

      this.$patch({ plans: validated.slice() })
    },

    /** Test **/
    async reset(): Promise<void> {
      const d = await getDB()
      const tx = d.transaction(STORE, 'readwrite')
      await tx.store.clear()
      await tx.done
      this.$patch({ plans: [] })
    },
  },
})
