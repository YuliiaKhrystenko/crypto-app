<!-- src/pages/Home.vue -->
<template>
  <n-space vertical :size="16">
    <n-card class="hero" size="large" :segmented="{ content: true, footer: 'soft' }" hoverable>
      <template #header>
        <n-space align="center" justify="space-between" wrap>
          <n-gradient-text
            gradient="linear-gradient(135deg,#60a5fa 0%,#22d3ee 50%,#a78bfa 100%)"
            class="title"
          >
            Dollar
          </n-gradient-text>
          <n-space>
            <RouterLink to="/plans">
              <n-button type="primary" size="large">
                <n-icon :component="Calendar" />&nbsp;Create plan
              </n-button>
            </RouterLink>
            <RouterLink to="/backtest">
              <n-button tertiary size="large">
                <n-icon :component="TrendingUp" />&nbsp;Run backtest
              </n-button>
            </RouterLink>
          </n-space>
        </n-space>
      </template>

      <n-text depth="3" class="subtitle">
        A minimalist app for long-term crypto investors and fintech learners. Plan your dollar-cost
        averaging, simulate results, and track portfolio value — all in here.
      </n-text>

      <template #footer>
        <n-grid :cols="3" :x-gap="12" :y-gap="12">
          <n-gi>
            <n-statistic label="Focus" value="DCA · Backtests · Portfolio">
              <template #prefix>
                <n-icon :component="ShieldCheckmark" />
              </template>
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="Privacy" value="Local-first · IndexedDB cache">
              <template #prefix>
                <n-icon :component="LockClosed" />
              </template>
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="Tech" value="Vue 3 · TS · PWA">
              <template #prefix>
                <n-icon :component="Sparkles" />
              </template>
            </n-statistic>
          </n-gi>
        </n-grid>
      </template>
    </n-card>

    <n-grid :cols="3" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-card hoverable>
          <template #header>
            <n-space align="center"> <n-icon :component="Calendar" /> Plan </n-space>
          </template>
          <n-ul>
            <li>Create weekly or monthly DCA plans</li>
            <li>Fees support (flat & percent)</li>
            <li>Multiple base currencies</li>
          </n-ul>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card hoverable>
          <template #header>
            <n-space align="center"> <n-icon :component="TrendingUp" />Backtest </n-space>
          </template>
          <n-ul>
            <li>Simulate results with historical prices</li>
            <li>Web Worker — no UI lag</li>
            <li>Charts with lightweight-charts</li>
          </n-ul>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card hoverable>
          <template #header>
            <n-space align="center"> <n-icon :component="PieChart" />Portfolio </n-space>
          </template>
          <n-ul>
            <li>Track invested vs current value</li>
            <li>PNL & Max Drawdown</li>
            <li>PWA install for quick access</li>
          </n-ul>
        </n-card>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<script setup lang="ts">
import {
  Calendar,
  TrendingUp,
  ShieldCheckmark,
  LockClosed,
  Sparkles,
  PieChart,
} from '@vicons/ionicons5'
</script>

<style scoped>
.hero {
  background:
    radial-gradient(800px 400px at 0% -20%, rgba(96, 165, 250, 0.18) 0%, transparent 60%),
    radial-gradient(800px 400px at 120% 20%, rgba(34, 211, 238, 0.16) 0%, transparent 60%),
    color-mix(in oklab, var(--n-color) 92%, transparent);
  border-radius: 16px;
}

.title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.subtitle {
  display: block;
  max-width: 900px;
}

:deep(.n-card-header) {
  padding-bottom: 8px;
}
</style>
