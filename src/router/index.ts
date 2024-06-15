import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/chat/Chat.vue')
  },
  {
    path: '/slide',
    name: 'slide' ,
    component: () => import('../views/slide/Slide.vue'),
  },
  {
    path: '/submenu',
    name: 'submenu',
    component: () => import('../views/submenu/Submenu.vue')
  },
  {
    path: '/',
    redirect: '/chat'
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

