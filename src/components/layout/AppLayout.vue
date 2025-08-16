<template>
  <n-layout position="absolute" class="shell">
    <n-layout-header
      bordered
      class="header"
      position="absolute"
      :style="{ height: 'var(--header-h)', left: '0', right: '0', top: '0' }"
    >
      <AppHeader
        :is-dark="isDark"
        @toggle-theme="$emit('toggle-theme')"
        @toggle-sidebar="drawer = true"
      />
    </n-layout-header>

    <n-layout
      position="absolute"
      :style="{ top: 'var(--header-h)', bottom: 'var(--footer-h)', left: '0', right: '0' }"
    >
      <n-layout-content content-style="padding:24px;">
        <div class="container">
          <slot />
        </div>
      </n-layout-content>
    </n-layout>

    <n-layout-footer
      bordered
      class="footer"
      position="absolute"
      :style="{ height: 'var(--footer-h)', left: '0', right: '0', bottom: '0' }"
    >
      <AppFooter />
    </n-layout-footer>

    <n-drawer v-model:show="drawer" placement="left" :width="300">
      <n-drawer-content title="Menu">
        <AppSidebar @navigate="drawer = false" />
      </n-drawer-content>
    </n-drawer>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'
defineProps<{ isDark: boolean }>()
defineEmits<{ (e: 'toggle-theme'): void }>()
const drawer = ref(false)
</script>

<style scoped>
.shell {
  position: absolute;
  inset: 0;
  --header-h: 64px;
  --footer-h: 56px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  z-index: 50;
}

.footer {
  display: flex;
  align-items: center;
  z-index: 50;
}
</style>
