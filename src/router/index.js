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
      path: '/songlist',
      name: 'songlist',
      component: () => import('@/views/songlist/index.vue')
    },
    {
      path: '/songlist-details',
      name: 'songlist-details',
      component: () => import('@/views/songlist/details.vue')
    },
    {
      path: '/ranklist',
      name: 'ranklist',
      component: () => import('@/views/ranklist/index.vue')
    },
    {
      path: '/ranklist-details',
      name: 'ranklist-details',
      component: () => import('@/views/ranklist/details.vue')
    },
  ]
})

export default router