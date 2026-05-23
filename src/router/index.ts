import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'map-2d',
      component: () => import('@/views/Map2D.vue'),
    },
    {
      path: '/flight-3d',
      name: 'map-3d',
      component: () => import('@/views/Map3D.vue'),
    },
  ],
})

export default router
