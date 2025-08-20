// src/types/dca.ts
import { z } from 'zod'

export type DcaPeriod = 'weekly' | 'monthly'

export interface DcaPlan {
  id: string
  asset: string
  amount: number
  period: DcaPeriod
  startDate: string     
  feePct: number
  feeFlat: number
  active: boolean
  createdAt: number
  updatedAt: number
}

export type DcaPlanInput = Pick<
  DcaPlan,
  'asset' | 'amount' | 'period' | 'startDate' | 'feePct' | 'feeFlat'
> & Partial<Pick<DcaPlan, 'active'>>

export type DcaPlanPatch = Partial<
  Pick<DcaPlan, 'asset' | 'amount' | 'period' | 'startDate' | 'feePct' | 'feeFlat' | 'active'>
>

/* ---------- Zod ---------- */

export const zDcaPlanInput = z.object({
  asset: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(['weekly', 'monthly']),
  startDate: z.string().min(1),
  feePct: z.number().min(0),
  feeFlat: z.number().min(0),
  active: z.boolean().optional(),
})

export const zDcaPlan: z.ZodType<DcaPlan> = z.object({
  id: z.string(),
  asset: z.string().min(1),
  amount: z.number().nonnegative(),
  period: z.enum(['weekly', 'monthly']),
  startDate: z.string(),
  feePct: z.number().min(0),
  feeFlat: z.number().min(0),
  active: z.boolean(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
})
