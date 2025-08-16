import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DCA Coach',
        short_name: 'DCA Coach',
        description: 'DCA simulator and portfolio dashboard',
        theme_color: '#111827',
        background_color: '#0b0f19',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: false },
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/components.d.ts',
    }),
  ]

  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        filename: 'reports/bundle/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
        '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
        '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
        '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },
  }
})
