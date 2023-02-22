import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search/index.vue')
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('@/views/music/index.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('@/views/about.vue')
    }
  ]
})

export default router