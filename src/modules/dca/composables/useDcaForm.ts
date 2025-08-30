import { reactive, ref, watch, type Ref } from 'vue'
import type { FormInst, FormRules, SelectOption } from 'naive-ui'
import type { DcaPlan, DcaPlanInput } from '../../../types/dca'
import { emptyForm, PERIOD_OPTIONS, toPlanInput, type DcaFormModel } from '../form'

export function useDcaForm(initialRef: Ref<DcaPlan | null>) {
  const formRef = ref<FormInst | null>(null)
  const form = reactive<DcaFormModel>(emptyForm())

  const periodOptions: SelectOption[] = PERIOD_OPTIONS.map(o => ({
    label: o.label,
    value: o.value,
  }))

  const rules: FormRules = {
    asset:     { required: true, message: 'Asset is required', trigger: ['input', 'blur'] },
    amount:    { required: true, type: 'number', message: 'Enter amount', trigger: ['input', 'blur'] },
    period:    { required: true, message: 'Pick period', trigger: ['change'] },
    startDate: { required: true, message: 'Pick date', trigger: ['change'] },
    feePct:    { type: 'number' },
    feeFlat:   { type: 'number' },
  }

  watch(
    initialRef,
    (i) => {
      if (i) {
        form.asset     = i.asset
        form.amount    = i.amount
        form.period    = i.period
        form.startDate = i.startDate ?? null
        form.feePct    = i.feePct
        form.feeFlat   = i.feeFlat
        form.active    = i.active
      } else {
        Object.assign(form, emptyForm())
      }
    },
    { immediate: true }
  )
  
  async function validateAndBuild(): Promise<DcaPlanInput> {
    await formRef.value?.validate()
    const payload = toPlanInput({
      ...form,
      asset: form.asset.trim(),
    })
    return payload
  }

  function reset() {
    Object.assign(form, emptyForm())
  }

  return {
    formRef,
    form,
    rules,
    periodOptions,
    validateAndBuild,
    reset,
  }
}
