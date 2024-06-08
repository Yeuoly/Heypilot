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
    path: '/test',
    name: 'test' ,
    component: () => import('../views/test/Test.vue'),
  },
  {
    path: '/',
    redirect: '/test'
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

