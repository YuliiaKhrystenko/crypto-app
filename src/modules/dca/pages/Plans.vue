<!-- src/modules/dca/pages/Plans.vue -->
<template>
  <div class="page">
    <n-page-header>
      <template #title>DCA Plans</template>
      <template #extra>
        <n-space align="center" :size="8">
          <n-tag :bordered="false" size="small">{{ store.plans.length }} plans</n-tag>
          <n-button type="primary" @click="openCreate">New plan</n-button>
        </n-space>
      </template>
    </n-page-header>

    <n-grid v-if="!store.isReady" cols="1 s:2 m:3" :x-gap="12" :y-gap="12">
      <n-grid-item v-for="i in 6" :key="i">
        <n-card :bordered="true" size="small">
          <n-skeleton text style="width: 35%; margin-bottom: 6px" />
          <n-skeleton text :repeat="2" />
          <n-space justify="space-between" align="center" style="margin-top: 8px">
            <n-skeleton text style="width: 72px" />
            <n-skeleton text style="width: 140px" />
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-empty v-else-if="isEmpty" description="No plans yet">
      <template #extra>
        <n-button type="primary" @click="openCreate">Create first plan</n-button>
      </template>
    </n-empty>

    <n-grid v-else cols="1 s:2 m:3" :x-gap="12" :y-gap="12">
      <n-grid-item v-for="p in store.plans" :key="p.id">
        <n-card :bordered="true" size="small">
          <template #header>
            <n-space align="center" justify="space-between" style="width: 100%">
              <div class="title">{{ p.asset }}</div>
              <n-tag :type="p.active ? 'success' : 'default'" size="small" :bordered="false">
                {{ p.active ? 'Active' : 'Paused' }}
              </n-tag>
            </n-space>
          </template>

          <n-space vertical size="small">
            <div class="muted">Amount: <b>{{ fmtAmount(p.amount) }}</b></div>
            <div class="muted">Period: <b>{{ periodLabel(p.period) }}</b></div>
            <div class="muted">Start: <b>{{ fmtDate(p.startDate) }}</b></div>
            <div class="muted">Fees: <b>{{ fmtFee(p.feePct, p.feeFlat) }}</b></div>

            <n-space justify="space-between" align="center" style="margin-top: 6px">
              <n-space :size="8" align="center">

                <n-switch
                  :value="p.active"
                  :round="false"
                  aria-label="Toggle active"
                  :disabled="isBusy(p.id)"
                  @update:value="toggle(p)"
                >
                  <template #checked>On</template>
                  <template #unchecked>Off</template>
                </n-switch>
              </n-space>

              <n-space :size="8">
                <n-button size="small" :disabled="isBusy(p.id)" @click="openEdit(p)">Edit</n-button>

                <n-popconfirm
                  positive-text="Delete"
                  negative-text="Cancel"
                  :show-icon="false"
                  @positive-click="remove(p.id)"
                >
                  <template #trigger>
                    <n-button size="small" tertiary type="error" :loading="isBusy(p.id)">Delete</n-button>
                  </template>
                  Remove <b>{{ p.asset }}</b> plan permanently?
                </n-popconfirm>
              </n-space>
            </n-space>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>

    <RouterView style="display:none" />

    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="editing ? 'Edit plan' : 'New plan'"
      style="max-width: 520px"
    >
      <PlanForm
        :initial="editing ?? null"
        :submitting="saving"
        @cancel="closeModal"
        @submit="onSubmit"
      />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import {
  useMessage,
  NButton, NCard, NEmpty, NGrid, NGridItem, NModal, NPageHeader, NSpace, NSwitch, NTag,
  NSkeleton, NPopconfirm
} from 'naive-ui'
import { useDcaStore } from '@stores/dca'
import PlanForm from '../components/PlanForm.vue'
import type { DcaPlan, DcaPlanInput } from '../../../types/dca'
import { useAsyncState, useAsyncByKey } from '@composables/async'

const route   = useRoute()
const router  = useRouter()
const store   = useDcaStore()
const message = useMessage()

const editing = ref<DcaPlan | null>(null)

const { pending: saving, run: runSave } = useAsyncState(async (payload: DcaPlanInput) => {
  if (editing.value) {
    await store.updatePlan(editing.value.id, payload)
    message.success('Plan updated')
  } else {
    await store.addPlan(payload)
    message.success('Plan created')
  }
}, { onError: (e) => message.error((e as Error).message || 'Error') })

const { isPending: isBusy, run: runByKey } = useAsyncByKey({ onError: (e) => message.error((e as Error).message || 'Error') })

onMounted(async () => {
  await store.init()
})

const isEmpty = computed(() => store.isReady && store.plans.length === 0)

const showModal = computed({
  get: () => route.name === 'plan-new' || route.name === 'plan-edit',
  set: (v: boolean) => {
    if (!v && (route.name === 'plan-new' || route.name === 'plan-edit')) {
      if (window.history.state?.back) router.back()
      else router.replace({ name: 'plans' })
    }
  }
})

watchEffect(() => {
  if (!store.isReady) return
  if (route.name === 'plan-edit') {
    const id = String(route.params.id ?? '')
    editing.value = store.planById(id) ?? null
    if (!editing.value) {
      message.error('Plan not found')
      router.replace({ name: 'plans' })
    }
  } else {
    editing.value = null
  }
})

async function openCreate() {
  await router.push({ name: 'plan-new' })
}
async function openEdit(p: DcaPlan) {
  await router.push({ name: 'plan-edit', params: { id: p.id } })
}
function closeModal() {
  showModal.value = false
}

async function onSubmit(payload: DcaPlanInput) {
  await runSave(payload)
  closeModal()
}

async function toggle(p: DcaPlan) {
  await runByKey(p.id, () => store.toggleActive(p.id))
}
async function remove(id: string) {
  await runByKey(id, () => store.removePlan(id))
  message.success('Deleted')
}

const amountFmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
function fmtAmount(n: number) { return amountFmt.format(n ?? 0) }
function periodLabel(p: string) { return p === 'weekly' ? 'Weekly' : p === 'monthly' ? 'Monthly' : p }
function fmtDate(s?: string | null) { return s ? new Date(`${s}T00:00:00`).toLocaleDateString() : '—' }
function fmtFee(pct?: number, flat?: number) { return `${pct ?? 0}% + ${amountFmt.format(flat ?? 0)}` }
</script>

<style scoped>
.page { padding: 12px; }
.title { font-weight: 600; letter-spacing: .2px; }
.muted { color: var(--naive-text-color-3); font-size: 12px; }
</style>
