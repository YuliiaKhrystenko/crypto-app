// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../pages/Home.vue') },
    { path: '/plans', component: () => import('../pages/Plans.vue') },
    { path: '/backtest', component: () => import('../pages/Backtest.vue') },
    { path: '/portfolio', component: () => import('../pages/Portfolio.vue') },
  ],
})
