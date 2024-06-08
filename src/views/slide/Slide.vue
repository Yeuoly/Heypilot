<template>
    <div class="bg-gray-900 bg-opacity-60 h-full w-full rounded-lg p-2 text-white" @mousemove="onMouseMove">
        <div class="w-full h-full flex flex-col space-y-4">
            <div class="w-full flex flex-row-reverse">
                <div class="w-5 cursor-pointer" @click="onHideClick">
                    <Min class="w-5" />
                </div>
            </div>
            <div class="flex-grow">
                <div class="py-2" v-for="(message, key) in messages" :key="key">
                    <div>
                        {{ message.role == 'user' ? 'Me' : 'Bot' }}:
                    </div>
                    <div class="flex">
                        <div class="px-1">
                            >
                        </div>
                        <div v-if="message.role == 'user'" class="h-10 flex">
                            <img v-for="image in message.images"
                                class="p-2 rounded-lg h-10" 
                                :src="image" alt=""
                            >
                        </div>
                        <div class="flex-grow">
                            {{ message.content }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full p-2">
                <div class="w-full pb-2" v-if="attachImages.length">
                    <img v-for="image in attachImages" :src="image" alt="screenshot" class="h-10 rounded-lg">
                </div>
                <div class="w-full flex">
                    <div class="w-6 cursor-pointer" @click="onMaxClick">
                        <Max class="w-4 mt-1" />
                    </div>
                    <div class="flex-grow">
                        <input ref="input" type="text"
                            class="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                            placeholder="Type your question" v-model="text" @keydown.enter="sendMessage">
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
import { appWindow } from '@tauri-apps/api/window'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { changeToNormalMode, hideWindow } from '../../utils/window'
import { FetchImage } from '../../utils/tauri_command'
import Max from './icons/max.svg'
import Min from './icons/min.svg'
import Send from './icons/send.svg'
import { Event } from '../../event/enum'
import { ModelManager } from '../../core/model_runtime/model_manager'
import { PromptMessageImageContentDetail, PromptMessageRole } from '../../core/model_runtime/__base/entities'
import { LLMResultChunk } from '../../core/model_runtime/__base/llm_entities'

const route = useRoute()

const messages = ref<{
    role: 'user' | 'assistant',
    content: string | any[],
    images: string[]
}[]>([])

const text = ref('')
const attachImages = ref<string[]>([])
const active = ref(true)
const timer = ref<any>(null)
const onMouseMove = () => {
    active.value = true
}
const startActiveTimer = () => {
    timer.value = setInterval(async () => {
        if (!active.value) {
            if (!await appWindow.isFocused()) {
                onHideClick()
            }
        }
        active.value = false
    }, 6000)
}


onMounted(() => {
    onUnmounted(watch(text, () => {
        active.value = true
    }))

    onUnmounted(watch(route.query, async () => {
        const image = route.query.image as string
        console.log(image)
        if (image) {
            attachImages.value = [await FetchImage(image)]
        }
    }, { deep: true, immediate: true }))
    startActiveTimer()
})

const onMaxClick = () => {
    changeToNormalMode()
}
const onHideClick = () => {
    //router.push('/chat')
    //hideWindow()
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

const sendMessage = async () => {
    messages.value.push({
        role: 'user',
        content: text.value,
        images: [...attachImages.value]
    })

    // clear text
    text.value = ''
    // clear images
    attachImages.value = []

    const llm = await ModelManager.GetModelInstance('openai', 'gpt-4o')
    llm.invoke('gpt-4o', {
        api_key: import.meta.env.VITE_OPENAI_KEY,
    }, 
    [
        {
            role: PromptMessageRole.SYSTEM,
            content: 'You are a helpful assistant'
        }, 
        ...messages.value.map((v) => {
            return {
                role: v.role === 'user' ? PromptMessageRole.USER : PromptMessageRole.ASSISTANT,
                content: v.images.length ? [
                    ...v.images.map((image) => {
                        return {
                            type: 'image',
                            data: image,
                            detail: PromptMessageImageContentDetail.LOW
                        }
                    }),
                    {
                        type: 'text',
                        data: v.content
                    }
                ] : v.content
            }
        })
    ], {}, [], [], [{
        onMessage(message: LLMResultChunk) {
            // get last message
            const lastMessage = messages.value[messages.value.length - 1]
            if (lastMessage.role === 'user') {
                messages.value.push({
                    role: 'assistant',
                    content: message.delta.message.content as string || '',
                    images: []
                })
            } else {
                messages.value[messages.value.length - 1].content += message.delta.message.content as string || ''
            }
        }
    }])
}

</script>