<!-- src/modules/dca/pages/Plans.vue -->
<template>
  <div class="page">
    <n-page-header title="DCA Plans">
      <template #extra>
        <n-button type="primary" @click="openCreate">New plan</n-button>
      </template>
    </n-page-header>

    <n-empty v-if="isEmpty" description="No plans yet">
      <template #extra>
        <n-button type="primary" @click="openCreate">Create first plan</n-button>
      </template>
    </n-empty>

    <n-grid v-else cols="1 s:2 m:3" :x-gap="12" :y-gap="12">
      <n-grid-item v-for="p in store.plans" :key="p.id">
        <n-card :title="p.asset" :bordered="true" size="small">
          <n-space vertical size="small">
            <div class="muted">Amount: <b>{{ p.amount }}</b></div>
            <div class="muted">Period: <b>{{ p.period }}</b></div>
            <div class="muted">Start: <b>{{ p.startDate }}</b></div>
            <div class="muted">Fees: <b>{{ p.feePct }}% + {{ p.feeFlat }}</b></div>

            <n-space justify="space-between" align="center">
              <n-tag :type="p.active ? 'success' : 'default'">
                {{ p.active ? 'Active' : 'Paused' }}
              </n-tag>
              <n-space>
                <n-switch :value="p.active" :round="false" @update:value="toggle(p)">
                  <template #checked>On</template>
                  <template #unchecked>Off</template>
                </n-switch>
                <n-button size="small" @click="openEdit(p)">Edit</n-button>
                <n-button size="small" tertiary type="error" @click="askRemove(p)">Delete</n-button>
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
        :submitting="submitting"
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
  useMessage, useDialog,
  NButton, NCard, NEmpty, NGrid, NGridItem, NModal, NPageHeader, NSpace, NSwitch, NTag
} from 'naive-ui'
import { useDcaStore } from '@stores/dca'
import PlanForm from '../components/PlanForm.vue'
import type { DcaPlan, DcaPlanInput } from '../../../types/dca'

const route = useRoute()
const router = useRouter()
const store = useDcaStore()
const message = useMessage()
const dialog = useDialog()

const submitting = ref(false)
const editing = ref<DcaPlan | null>(null)

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
  submitting.value = true
  try {
    if (editing.value) {
      await store.updatePlan(editing.value.id, payload)
      message.success('Plan updated')
    } else {
      await store.addPlan(payload)
      message.success('Plan created')
    }
    closeModal()
  } catch (e) {
    console.error(e)
    message.error((e as Error).message || 'Error')
  } finally {
    submitting.value = false
  }
}

async function toggle(p: DcaPlan) {
  try {
    await store.toggleActive(p.id)
  } catch (e) {
    message.error((e as Error).message)
  }
}

function askRemove(p: DcaPlan) {
  dialog.warning({
    title: 'Delete plan?',
    content: `Remove ${p.asset} plan permanently?`,
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      await store.removePlan(p.id)
      message.success('Deleted')
    },
  })
}
</script>

<style scoped>
.page { padding: 12px; }
.muted { color: var(--naive-text-color-3); font-size: 12px; }
</style>
