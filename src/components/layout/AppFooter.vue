<template>
  <div class="footer">
    <n-text depth="3"> © {{ year }} DCA Coach </n-text>
    <n-space :size="8">
      <a href="https://example.com" target="_blank" rel="noreferrer">Docs</a>
      <a href="https://example.com" target="_blank" rel="noreferrer">Changelog</a>
    </n-space>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 16px;
}

a {
  color: var(--n-primary-color);
  opacity: 0.85;
}

a:hover {
  opacity: 1;
}
</style>
