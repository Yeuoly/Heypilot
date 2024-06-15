<template>
    <div class="bg-gray-900 bg-opacity-60 h-full w-full rounded-lg p-2 text-white" @mousemove="onMouseMove">
        <div class="w-full h-full flex flex-col">
            <div class="w-full flex flex-row-reverse">
                <div class="w-5 cursor-pointer" @click="onHideClick">
                    <Min class="w-5" />
                </div>
            </div>
            <div ref="messageContainer" class="flex-grow overflow-auto pr-3">
                <div class="flex-col space-y-1">
                    <div v-for="(message, key) in messages" :key="key">
                        <div class="flex py-1">
                            <div class="w-6 mr-2">
                                <Bot class="w-6" v-if="message.role == 'assistant'" />
                                <User class="w-6" v-else />
                            </div>
                            <div class="flex-grow break-words whitespace-normal">
                                <div v-if="message.role == 'user' && message.images.length > 0" class="h-15 flex pb-1">
                                    <img v-for="image in message.images"
                                        class="rounded-lg mr-2 h-10" 
                                        :src="image" alt=""
                                    >
                                </div>
                                <div class="break-words whitespace-normal">
                                    <div v-html="message.marked_content"></div>
                                </div>
                            </div>
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
import { changeToNormalMode } from '../../utils/chat_mode'
import Max from './icons/max.svg'
import Min from './icons/min.svg'
import Send from './icons/send.svg'
import Bot from './icons/bot.svg'
import User from './icons/user.svg'
import { useActiveMonitor, useGlobalEvent, useGlobalContextEvent } from './window_events'
import { useConversation } from './conversation'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { hideWindow } from '../../utils/window'

const messageContainer = ref<HTMLElement | null>(null)
const inputContainer = ref<HTMLInputElement | null>(null)

const router = useRouter()

const onHideClick = () => {
    router.push('/chat')
    hideWindow()
}

const onMaxClick = () => {
    changeToNormalMode()
}

const { attachImages, imagePaths, context, text } = useGlobalContextEvent()
const { onMouseMove } = useActiveMonitor(context, text, onHideClick)
const { messages, sendMessage } = useConversation(messageContainer, text, context, imagePaths)
useGlobalEvent(inputContainer)
</script>

<style>
pre code {
    font-size: 12px !important;
    padding: 8px !important;
    border-radius: 8px;
}

pre {
    padding-top: 8px;
    padding-bottom: 8px;
}
</style>