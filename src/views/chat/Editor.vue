<template>
    <div class="flex items-center bg-gray-900 rounded-full w-full h-12">
        <button class="text-gray-400 hover:text-gray-300 focus:outline-none w-12" @click="onScreenShot">
            <Screenshot class="w-6 text-white ml-4" />
        </button>
        <input type="text" placeholder="Type your question" class="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none">
        <button class="text-gray-400 hover:text-gray-300 focus:outline-none w-10">
            <Send class="w-5" />
        </button>
        <img v-if="image" :src="image" alt="screenshot" class="w-10 h-10 rounded-full ml-4">
    </div>
</template>

<script setup lang="ts">
import Send from './icons/send.svg'
import Screenshot from './icons/screenshot.svg'
import { screenShot } from '../../utils/screenshot'
import { ref } from 'vue'

const image = ref<string | null>(null)

const onScreenShot = async () => {
    const response = await screenShot({
        x: 0, y: 0,
        width: window.innerWidth, height: window.innerHeight
    })

    image.value = 'data:image/png;base64,' + response
}

</script>