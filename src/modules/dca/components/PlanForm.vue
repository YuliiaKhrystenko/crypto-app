<!-- src/modules/dca/components/PlanForm.vue -->
<template>
  <n-form ref="formRef" :model="form" :rules="rules" label-placement="top" @submit.prevent="onSubmit">
    <n-form-item label="Asset" path="asset">
      <n-input v-model:value="form.asset" placeholder="e.g. BTC" />
    </n-form-item>

    <n-form-item label="Amount" path="amount">
      <n-input-number v-model:value="form.amount" :min="0" :precision="2" />
    </n-form-item>

    <n-form-item label="Period" path="period">
      <n-select v-model:value="form.period" :options="periodOptions" />
    </n-form-item>

    <n-form-item label="Start date" path="startDate">
      <n-date-picker
        v-model:formatted-value="form.startDate"
        value-format="yyyy-MM-dd"
        type="date"
        :default-value="Date.now()"
        clearable
      />
    </n-form-item>

    <n-form-item label="Fee, %" path="feePct">
      <n-input-number v-model:value="form.feePct" :min="0" :precision="2" />
    </n-form-item>

    <n-form-item label="Fee, flat" path="feeFlat">
      <n-input-number v-model:value="form.feeFlat" :min="0" :precision="2" />
    </n-form-item>

    <n-form-item label="Active">
      <n-switch v-model:value="form.active" />
    </n-form-item>

    <n-space justify="end">
      <n-button quaternary @click="emit('cancel')">Cancel</n-button>
      <n-button type="primary" :loading="submitting" @click="onSubmit">Save</n-button>
    </n-space>
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import {
  NForm, NFormItem, NInput, NInputNumber, NSelect, NDatePicker, NSwitch, NButton, NSpace,
  type FormInst, type FormRules, type SelectOption
} from 'naive-ui'
import type { DcaPlan, DcaPlanInput } from '../../../types/dca'

const props = defineProps<{
  initial: DcaPlan | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: DcaPlanInput): void
  (e: 'cancel'): void
}>()

type FormModel = Omit<DcaPlanInput, 'startDate'> & { startDate: string | null }

const formRef = ref<FormInst | null>(null)
const form = reactive<FormModel>({
  asset: '',
  amount: 0,
  period: 'weekly',
  startDate: null,      
  feePct: 0,
  feeFlat: 0,
  active: true,
})

const periodOptions: SelectOption[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const rules: FormRules = {
  asset: { required: true, message: 'Asset is required', trigger: ['input', 'blur'] },
  amount: { required: true, type: 'number', message: 'Enter amount', trigger: ['input', 'blur'] },
  period: { required: true, message: 'Pick period', trigger: ['change'] },
  startDate: { required: true, message: 'Pick date', trigger: ['change'] },
  feePct: { type: 'number' },
  feeFlat: { type: 'number' },
}

watchEffect(() => {
  if (props.initial) {
    const i = props.initial
    form.asset = i.asset
    form.amount = i.amount
    form.period = i.period
    form.startDate = i.startDate ?? null
    form.feePct = i.feePct
    form.feeFlat = i.feeFlat
    form.active = i.active
  } else {
    form.asset = ''
    form.amount = 0
    form.period = 'weekly'
    form.startDate = null
    form.feePct = 0
    form.feeFlat = 0
    form.active = true
  }
})

async function onSubmit() {
  await formRef.value?.validate()
  if (!form.startDate) return 

  const payload: DcaPlanInput = {
    asset: form.asset.trim(),
    amount: form.amount,
    period: form.period,
    startDate: form.startDate,
    feePct: form.feePct,
    feeFlat: form.feeFlat,
    active: form.active,
  }
  emit('submit', payload)
}
</script>
