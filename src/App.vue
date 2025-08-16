<!-- src/App.vue -->
<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="theme">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <AppLayout :is-dark="isDark" @toggle-theme="isDark = !isDark">
            <RouterView />
          </AppLayout>
          <n-back-top :right="32" :bottom="32" />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import AppLayout from '@components/layout/AppLayout.vue'

const isDark = ref(true)
const theme: GlobalThemeOverrides = {
  common: {
    primaryColor: '#4f46e5',
    borderRadius: '10px',
  },
  Card: { color: '#0f172a', borderColor: '#1f2937' },
  Button: { textColorTextPrimary: '#cbd5e1' },
}
</script>

<style>
/* м’який фон + легка «глибина» */
html,
body,
#app {
  height: 100%;
}

body {
  background:
    radial-gradient(1200px 600px at 10% -10%, #4f46e522 0%, transparent 60%),
    radial-gradient(900px 500px at 110% 20%, #22d3ee22 0%, transparent 60%), #0b0f19;
}

a {
  text-decoration: none;
}
</style>
