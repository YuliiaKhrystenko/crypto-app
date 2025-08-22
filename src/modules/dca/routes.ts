// src/modules/dca/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const RouteModalStub = { render: () => null }

export const dcaRoutes: RouteRecordRaw[] = [
  {
    path: '/plans',
    name: 'plans',
    component: () => import('./pages/Plans.vue'),
    meta: { module: 'dca' },
    children: [
      {
        path: 'new',
        name: 'plan-new',
        component: RouteModalStub, 
        meta: { module: 'dca' },
      },
      {
        path: ':id',
        name: 'plan-edit',
        component: RouteModalStub,
        props: true,
        meta: { module: 'dca' },
      },
    ],
  },
  {
    path: '/backtest',
    name: 'backtest',
    component: () => import('./pages/Backtest.vue'),
    meta: { module: 'dca' },
  },
]
