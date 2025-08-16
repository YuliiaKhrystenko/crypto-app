<template>
  <div class="sidebar">
    <template v-if="collapsed">
      <n-space vertical :size="8" class="icon-col">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle @click="go('/plans')">
              <n-icon size="20">
                <AddCircle />
              </n-icon>
            </n-button>
          </template>
          Create plan
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle @click="go('/backtest')">
              <n-icon size="20">
                <TrendingUp />
              </n-icon>
            </n-button>
          </template>
          Run backtest
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle @click="go('/plans')">
              <n-icon size="20">
                <List />
              </n-icon>
            </n-button>
          </template>
          Plans
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle @click="go('/portfolio')">
              <n-icon size="20">
                <PieChart />
              </n-icon>
            </n-button>
          </template>
          Portfolio
        </n-tooltip>
      </n-space>
    </template>

    <template v-else>
      <n-card size="small" title="Quick actions" hoverable>
        <n-space vertical>
          <n-button type="primary" block @click="go('/plans')"> Create plan </n-button>
          <n-button tertiary block @click="go('/backtest')"> Run backtest </n-button>
        </n-space>
      </n-card>

      <n-card size="small" title="Status" hoverable>
        <n-space vertical size="small">
          <n-progress type="line" :percentage="50" processing />
          <n-text depth="3"> Sprint 1 — UI </n-text>
        </n-space>
      </n-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AddCircle, TrendingUp, List, PieChart } from '@vicons/ionicons5'

defineProps<{ collapsed?: boolean }>()
const emit = defineEmits<{ (e: 'navigate'): void }>()
const router = useRouter()

function go(path: string) {
  router.push(path)
  emit('navigate')
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 10px;
  height: 100%;
}
:deep(.n-card) {
  border-radius: 12px;
}

/* колонка іконок у collapsed-режимі */
.icon-col {
  align-items: center;
}
.icon-col :deep(.n-button) {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  box-shadow:
    0 4px 18px rgba(15, 23, 42, 0.35) inset,
    0 1px 0 rgba(255, 255, 255, 0.06);
}
</style>
