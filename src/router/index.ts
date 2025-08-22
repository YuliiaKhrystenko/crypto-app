// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { dcaRoutes } from '@modules/dca/routes'

const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
    meta: { public: true },
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('../pages/Portfolio.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: { public: true },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...dcaRoutes],
  scrollBehavior: () => ({ top: 0 }),
})
