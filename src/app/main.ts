// src/app/main.ts
import { createApp } from 'vue'
import './pwa'

import '../styles/main.css'
import App from '../App.vue'
import { router } from '../router'

import { createPinia } from 'pinia'
import { useDcaStore } from '@stores/dca'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const app = createApp(App)
app.use(createPinia())
app.use(VueQueryPlugin, { queryClient: new QueryClient() })
app.use(router)

await useDcaStore().init()
app.mount('#app')
