import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './event/shortcut'
import { router } from './router/index'
import { pinia } from './store'
import './core/scenario/scenario_manager'

createApp(App).use(router).use(pinia).mount('#app')
