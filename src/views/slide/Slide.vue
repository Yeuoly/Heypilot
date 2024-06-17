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
            <div class="w-full p-1">
                <div class="w-full mb-1" v-if="attachImages.length">
                    <div v-for="(image, index) in attachImages" :key="index" class="relative inline-block mr-2">
                        <img :src="image" alt="screenshot" class="h-10 w-20 rounded-lg object-cover">
                        <div @click="removeImage()" class="absolute top-0 w-full h-full text-center opacity-0 hover:opacity-50 cursor-pointer transition bg-gray-700 rounded-lg">
                            <div class="h-full flex items-center justify-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
                                    <Remove class="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full flex p-2 bg-gray-800 rounded-lg mb-1" v-if="context.context.length">
                    <div class="w-6">
                        <Docs class="w-5" />
                    </div>
                    <div class="text-sm text-gray-500">
                        Context ({{ context.context.length }} characters)
                    </div>
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
                    <div class="w-5">
                        <Send class="w-5" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { changeToNormalMode } from '../../utils/chat'
import Max from './icons/max.svg'
import Min from './icons/min.svg'
import Send from './icons/send.svg'
import Bot from './icons/bot.svg'
import User from './icons/user.svg'
import Remove from './icons/remove.svg'
import Docs from './icons/docs.svg'
import { useActiveMonitor, useGlobalEvent, useGlobalContext } from './window_events'
import { useConversation } from './conversation'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { hideWindow } from '../../utils/window'
import { useChatContext } from '../../utils/context'
import { useAutoSending } from './auto_sending'

const messageContainer = ref<HTMLElement | null>(null)
const inputContainer = ref<HTMLInputElement | null>(null)
const { context } = useChatContext()

const router = useRouter()

const onHideClick = () => {
    router.push('/chat')
    hideWindow()
}

const onMaxClick = () => {
    changeToNormalMode()
}

const removeImage = () => {
    context.value.screenshot = ''
}

const { attachImages, imagePaths, text } = useGlobalContext()
const { messages, sendMessage } = useConversation(messageContainer, text, imagePaths)
const { onMouseMove } = useActiveMonitor(text, messages, onHideClick)
useAutoSending(context, text, sendMessage)
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