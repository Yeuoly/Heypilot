<template>
  <div class="bg-gray-900 bg-opacity-60 h-full w-full rounded-lg p-2 text-white" @mousemove="onMouseMove">
    <div class="w-full h-full flex flex-col space-y-4">
      <div class="w-full flex flex-row-reverse">
        <div class="w-5 cursor-pointer" @click="onHideClick">
          <Min class="w-5" />
        </div>
      </div>
      <div class="flex-grow">
        <div class="py-2">
          <div>
            Me: 
          </div>
          <div class="flex">
            <div class="px-1">
              >
            </div>
            <div class="flex-grow">
              Hello, what's on my screen
            </div>
          </div>
        </div>
      </div>
      <div class="my-4 w-full p-2">
        <div class="w-full flex">
          <div class="w-6 cursor-pointer" @click="onMaxClick">
            <Max class="w-4 mt-1" />
          </div>
          <div class="flex-grow">
            <input ref="input" type="text" class="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none" 
              placeholder="Type your question"
              v-model="text"
            >
          </div>
          <div class="w-4">
            <Send class="w-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { changeToNormalMode, hideWindow } from '../../utils/window'
import Max from './icons/max.svg'
import Min from './icons/min.svg'
import Send from './icons/send.svg'
import { Event } from '../../event/enum'

const router = useRouter()

const text = ref('')
const active = ref(true)
const timer = ref<any>(null)
const watchStop = ref<any>(null)
const onMouseMove = () => {
  active.value = true
}
const startActiveTimer = () => {
  timer.value = setInterval(() => {
    if (!active.value) {
      onHideClick()
    }
    active.value = false
  }, 6000)
}
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (watchStop.value) {
    watchStop.value()
  }
})
onMounted(() => {
  watchStop.value = watch(text, () => {
    active.value = true
  })
  startActiveTimer()
})

const onMaxClick = () => {
  changeToNormalMode()
}
const onHideClick = () => {
  router.push('/chat')
  hideWindow()
}
const focusInput = () => {
  input.value?.focus()
}

const input = ref<HTMLInputElement | null>(null)
let unset: any = null;
onMounted(async () => {
  focusInput()
  unset = await listen(Event.EVENT_SLIDE_FOCUS_INPUT, () => {
    focusInput()
  })

  
})

onUnmounted(() => {
  if (unset) {
    unset()
  }
})
</script>