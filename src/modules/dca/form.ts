// Single source of truth for the DCA plan form (UI layer)

import { z } from 'zod'
import { zDcaPlanInput } from '../../types/dca'

// Select options for period (typed & reusable)
export const PERIOD_OPTIONS = [
  { label: 'Weekly',  value: 'weekly'  },
  { label: 'Monthly', value: 'monthly' },
] as const
export type PeriodValue = typeof PERIOD_OPTIONS[number]['value']

// UI model allows startDate to be null while the user hasn't picked it yet
export const zDcaPlanInputForm = zDcaPlanInput.extend({
  startDate: z.string().min(1).nullable(), // nullable only in the UI layer
})

export type DcaFormModel = z.infer<typeof zDcaPlanInputForm>

/** Factory for an empty UI form model */
export function emptyForm(): DcaFormModel {
  return {
    asset: '',
    amount: 0,
    period: 'weekly',
    startDate: null,
    feePct: 0,
    feeFlat: 0,
    active: true,
  }
}

/** Convert UI model -> store input. Throws if invalid (zod). */
export function toPlanInput(model: DcaFormModel) {
  if (!model.startDate) throw new Error('Start date is required')
  // Validate and return the canonical input model
  return zDcaPlanInput.parse({
    ...model,
    startDate: model.startDate, // guaranteed string here
  })
}
