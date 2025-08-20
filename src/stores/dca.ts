// src/stores/dca.ts
import { defineStore } from 'pinia'
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import {
  zDcaPlanInput, zDcaPlan,
  type DcaPlan, type DcaPlanInput, type DcaPlanPatch
} from '../types/dca'

interface CoachDB extends DBSchema {
  plans: {
    key: string
    value: DcaPlan
    indexes: {
      'by-active': 0 | 1
      'by-createdAt': number
    }
  }
}

const DB_NAME = 'dca-coach'
const DB_VERSION = 1
const STORE = 'plans'

let _db: Promise<IDBPDatabase<CoachDB>> | null = null
async function db() {
  if (!_db) {
    _db = openDB<CoachDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const s = db.createObjectStore(STORE, { keyPath: 'id' })
          s.createIndex('by-active', 'active')   
          s.createIndex('by-createdAt', 'createdAt')
        }
      }
    })
  }
  return _db
}

/** DCA store */
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
    async init(): Promise<void> {
      if (this.isReady) return
      try {
        const d = await db()
        const rows = await d.getAll(STORE)
        const valid = rows.map(r => zDcaPlan.parse(r))
        this.$patch({ plans: valid, isReady: true })
      } catch (e) {
        console.error('[DCA] init error:', e)
        this.isReady = true
      }
    },

    // Add new plan
    async addPlan(input: DcaPlanInput): Promise<string> {
      const parsed = zDcaPlanInput.parse(input)

      const plan: DcaPlan = {
        ...parsed,
        id: crypto.randomUUID(),
        active: parsed.active ?? true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const d = await db()
      await d.put(STORE, plan)

      this.plans = [...this.plans, plan]
      return plan.id
    },

    // Update existing plan
    async updatePlan(id: string, patch: DcaPlanPatch): Promise<void> {
      const idx = this.plans.findIndex(p => p.id === id)
      if (idx < 0) throw new Error('Plan not found')

      const current = this.plans[idx]!
      const parsed = zDcaPlanInput.partial().parse(patch)

      const updated: DcaPlan = {
        ...current,
        asset:     parsed.asset     ?? current.asset,
        amount:    parsed.amount    ?? current.amount,
        period:    parsed.period    ?? current.period,
        startDate: parsed.startDate ?? current.startDate,
        feePct:    parsed.feePct    ?? current.feePct,
        feeFlat:   parsed.feeFlat   ?? current.feeFlat,
        active:    parsed.active    ?? current.active,
        updatedAt: Date.now(),
      }

      const d = await db()
      await d.put(STORE, updated)

      this.$patch(s => { s.plans[idx] = updated })
    },

    // Remove existing plan
    async removePlan(id: string): Promise<void> {
      const d = await db()
      await d.delete(STORE, id)
      this.plans = this.plans.filter(p => p.id !== id)
    },

    // Import/migration
    async setAll(plans: DcaPlan[]): Promise<void> {
      const validated = plans.map(p => zDcaPlan.parse(p))

      const d = await db()
      const tx = d.transaction(STORE, 'readwrite')
      await tx.store.clear()
      for (const p of validated) await tx.store.put(p)
      await tx.done

      this.$patch({ plans: validated.slice() })
    },
  },
})
