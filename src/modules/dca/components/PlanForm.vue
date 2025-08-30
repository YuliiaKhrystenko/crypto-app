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
import { toRef } from 'vue'
import { NForm, NFormItem, NInput, NInputNumber, NSelect, NDatePicker, NSwitch, NButton, NSpace } from 'naive-ui'
import type { DcaPlan, DcaPlanInput } from '../../../types/dca'
import { useDcaForm } from '../composables/useDcaForm'

const props = defineProps<{
  initial: DcaPlan | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: DcaPlanInput): void
  (e: 'cancel'): void
}>()

const { formRef, form, rules, periodOptions, validateAndBuild } = useDcaForm(toRef(props, 'initial'))

async function onSubmit() {
  const payload = await validateAndBuild()
  emit('submit', payload)
}
</script>
