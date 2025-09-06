<!-- src/modules/dca/components/PlanCard.vue -->
<template>
  <n-card :bordered="true" size="small">
    <template #header>
      <n-space align="center" justify="space-between" style="width: 100%">
        <div class="title">{{ plan.asset }}</div>
        <n-tag :type="plan.active ? 'success' : 'default'" size="small" :bordered="false">
          {{ plan.active ? 'Active' : 'Paused' }}
        </n-tag>
      </n-space>
    </template>

    <n-space vertical size="small">
      <div class="muted">Amount: <b>{{ formatAmountUSD(plan.amount) }}</b></div>
      <div class="muted">Period: <b>{{ labelPeriod(plan.period) }}</b></div>
      <div class="muted">Start: <b>{{ formatYMDToLocal(plan.startDate) }}</b></div>
      <div class="muted">Fees: <b>{{ formatFee(plan.feePct, plan.feeFlat) }}</b></div>

      <n-space justify="space-between" align="center" style="margin-top: 6px">
        <n-switch
          :value="plan.active"
          :round="false"
          :loading="busy"
          :disabled="busy"
          aria-label="Toggle active"
          @update:value="$emit('toggle')"
        >
          <template #checked>On</template>
          <template #unchecked>Off</template>
        </n-switch>

        <n-space :size="8">
          <n-button size="small" :disabled="busy" @click="$emit('edit')">Edit</n-button>

          <n-popconfirm
            positive-text="Delete"
            negative-text="Cancel"
            :show-icon="false"
            @positive-click="$emit('remove')"
          >
            <template #trigger>
              <n-button size="small" tertiary type="error" :loading="busy">Delete</n-button>
            </template>
            Remove <b>{{ plan.asset }}</b> plan permanently?
          </n-popconfirm>
        </n-space>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpace, NTag, NSwitch, NButton, NPopconfirm } from 'naive-ui'
import type { DcaPlan } from '../../../types/dca'
import { formatAmountUSD, labelPeriod, formatYMDToLocal, formatFee } from '../../../utils/format'

defineProps<{
  plan: DcaPlan
  busy?: boolean
}>()

defineEmits<{
  (e: 'edit'): void
  (e: 'toggle'): void
  (e: 'remove'): void
}>()
</script>

<style scoped>
.title { font-weight: 600; letter-spacing: .2px; }
.muted { color: var(--naive-text-color-3); font-size: 12px; }
</style>
