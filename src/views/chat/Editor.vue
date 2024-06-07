<template>
    <div class="flex items-center bg-gray-900 rounded-full w-full h-12">
        <button class="text-gray-400 hover:text-gray-300 focus:outline-none w-12">
            <Send class="w-8 text-white ml-2" />
        </button>
        <input type="text" placeholder="Type your question" class="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none">
        <button class="text-gray-400 hover:text-gray-300 focus:outline-none w-12">
            <Check class="w-8"></Check>
        </button>
    </div>
</template>

<script setup lang="ts">
import Send from './icons/send.svg'
import Check from './icons/check.svg'

</script>