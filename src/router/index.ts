import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/chat/Chat.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/Settings.vue'),
    children : [{
      path: '/settings/setup_model',
      name: 'setup_model',
      component: () => import('../views/settings/children/setup/Setup.vue')
    }, {
      path: '/settings/setup_scenario',
      name: 'setup_scenario',
      component: () => import('../views/settings/children/scenario/Setup.vue'),
      children: [{
        path: '/settings/setup_scenario/:id',
        name: 'edit_scenario',
        component: () => import('../views/settings/children/scenario/children/settings/Settings.vue')
      }]
    }, {
      path: '/settings',
      redirect: '/settings/setup_model'
    }]
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

