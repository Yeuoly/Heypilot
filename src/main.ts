import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './event/shortcut'
import { router } from './router/index'
import { pinia } from './store'

createApp(App).use(router).use(pinia).mount('#app')
