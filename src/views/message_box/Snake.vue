<template>
<slot></slot>
<div class="fixed bottom-0 right-0 p-4 z-50">
    <template v-for="message in messages" :key="message.id">
        <div class="bg-red-800 p-2 rounded-md m-2 shadow-md">
            <div class="flex justify-between">
                <div class="text-white">
                    {{ message.message }}
                </div>
            </div>
        </div>
    </template>
</div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { OpenSnakeMessagePayload } from './snake';

const timer = ref()
const messages = ref<{
    id: string,
    message: string,
    type: 'info' | 'error' | 'success' | 'warning'
}[]>([])

const openSnake = (p: OpenSnakeMessagePayload) => {
    const id = Math.random().toString()
    messages.value.push({ id, message: p.message, type: p.type || 'info' })
    timer.value = setTimeout(() => {
        messages.value = messages.value.filter(v => v.id !== id)
    }, p.duration || 3000)
}

provide('openSnakeMessage', openSnake)
</script>