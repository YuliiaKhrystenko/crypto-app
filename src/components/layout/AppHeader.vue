<template>
  <div
    class="h-full flex items-center justify-between gap-3 px-4 lg:px-6 backdrop-blur bg-white/5 border-b border-white/10"
  >
    <RouterLink to="/">
      <n-gradient-text
        gradient="linear-gradient(135deg,#60a5fa 0%,#22d3ee 50%,#a78bfa 100%)"
        class="text-2xl font-extrabold uppercase tracking-wider"
      >
        Dollar
      </n-gradient-text>
    </RouterLink>

    <nav class="ml-auto flex items-center gap-1">
      <div class="hidden sm:flex items-center gap-1">
        <RouterLink v-slot="{ href, navigate, isActive }" to="/" custom>
          <n-button
            text
            tag="a"
            :href="href"
            class="px-2"
            :type="isActive ? 'primary' : undefined"
            @click="navigate"
          >
            Home
          </n-button>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate, isActive }" to="/plans" custom>
          <n-button
            text
            tag="a"
            :href="href"
            class="px-2"
            :type="isActive ? 'primary' : undefined"
            @click="navigate"
          >
            Plans
          </n-button>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate, isActive }" to="/backtest" custom>
          <n-button
            text
            tag="a"
            :href="href"
            class="px-2"
            :type="isActive ? 'primary' : undefined"
            @click="navigate"
          >
            Backtest
          </n-button>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate, isActive }" to="/portfolio" custom>
          <n-button
            text
            tag="a"
            :href="href"
            class="px-2"
            :type="isActive ? 'primary' : undefined"
            @click="navigate"
          >
            Portfolio
          </n-button>
        </RouterLink>
      </div>

      <div class="mx-2 h-5 w-px bg-white/10 hidden sm:block" />

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button quaternary circle class="mx-0.5" @click="$emit('toggle-theme')">
            <n-icon size="18">
              <component :is="isDark ? Sunny : Moon" />
            </n-icon>
          </n-button>
        </template>
        {{ isDark ? 'Switch to Light' : 'Switch to Dark' }}
      </n-tooltip>

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button quaternary circle class="mx-0.5" @click="$emit('toggle-sidebar')">
            <n-icon size="18">
              <Menu />
            </n-icon>
          </n-button>
        </template>
        Menu
      </n-tooltip>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Moon, Sunny, Menu } from '@vicons/ionicons5'
defineProps<{ isDark: boolean }>()
defineEmits<{ (e: 'toggle-theme'): void; (e: 'toggle-sidebar'): void }>()
</script>
