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
        <PlanCard
          :plan="p"
          :busy="isBusy(p.id)"
          @edit="openEdit(p)"
          @toggle="toggle(p)"
          @remove="remove(p.id)"
        />
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
  NButton, NCard, NEmpty, NGrid, NGridItem, NModal, NPageHeader, NSpace, NTag, NSkeleton,
} from 'naive-ui'
import { useDcaStore } from '@stores/dca'
import PlanForm from '../components/PlanForm.vue'
import PlanCard from '../components/PlanCard.vue'
import type { DcaPlan, DcaPlanInput } from '../../../types/dca'
import { useAsyncState, useAsyncByKey } from '@composables/async'
import { useNotify } from '@composables/notify'

const route   = useRoute()
const router  = useRouter()
const store   = useDcaStore()
const notify = useNotify()

const editing = ref<DcaPlan | null>(null)

const { pending: saving, run: runSave } = useAsyncState(async (payload: DcaPlanInput) => {
  if (editing.value) {
    await store.updatePlan(editing.value.id, payload)
    notify.success('Plan updated')
  } else {
    await store.addPlan(payload)
    notify.success('Plan created')
  }
}, { onError: (e) => notify.error(e) })

const { isPending: isBusy, run: runByKey } = useAsyncByKey({ onError: (e) => notify.error(e) })

onMounted(async () => { await store.init() })

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
      notify.error('Plan not found')
      router.replace({ name: 'plans' })
    }
  } else {
    editing.value = null
  }
})

function openCreate() { router.push({ name: 'plan-new' }) }
function openEdit(p: DcaPlan) { router.push({ name: 'plan-edit', params: { id: p.id } }) }
function closeModal() { showModal.value = false }

async function onSubmit(payload: DcaPlanInput) {
  await runSave(payload)
  closeModal()
}

async function toggle(p: DcaPlan) {
  await runByKey(p.id, () => store.toggleActive(p.id))
}

async function remove(id: string) {
  await runByKey(id, () => store.removePlan(id))
  notify.success('Deleted')
}
</script>

<style scoped>
.page { padding: 12px; }
.title { font-weight: 600; letter-spacing: .2px; }
.muted { color: var(--naive-text-color-3); font-size: 12px; }
</style>
