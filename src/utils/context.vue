<template>
    <slot></slot>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { setChatContextListener, setChatScreenshotContextListener, setChatTextContextListener } from './context'

const conversationContext = ref({
    context: '',
    screenshot: ''
})

provide('chat_context', conversationContext)

setChatContextListener((context?: string, screenshot?: string) => {
    conversationContext.value.context = context || ''
    conversationContext.value.screenshot = screenshot || ''
})

setChatTextContextListener((text: string) => {
    conversationContext.value.context = text
})

setChatScreenshotContextListener((screenshot: string) => {
    conversationContext.value.screenshot = screenshot
})

</script>