<template>
  <div>
    <div class="rounded text-left w-full">
      <div class="h-10 flex items-center justify-left w-full hover:bg-gray-800 cursor-pointer
        transition duration-200 rounded-md">
        <div class="w-12">
          <ChatSVG class="w-10 px-2" />
        </div>
        <div class="text-sm font-semibold">
          New Chat
        </div>
      </div>
      <div class="mt-4 space-y-2">
        <p class="text-sm font-semibold text-gray-400">3 days</p>
        <button class="text-left w-full px-2 py-1 text-white hover:bg-gray-800 rounded-md truncate">What's your name?What's your name?What's your name?</button>
        <button class="text-left w-full px-2 py-1 text-white hover:bg-gray-800 rounded-md truncate">What's your name?</button>
        <button class="text-left w-full px-2 py-1 text-white hover:bg-gray-800 rounded-md truncate">What's your name?</button>
        <button class="text-left w-full px-2 py-1 text-white hover:bg-gray-800 rounded-md truncate">What's your name?</button>
        <p class="text-sm font-semibold text-gray-400">30 days</p>
        <button class="text-left w-full px-2 py-1 text-white hover:bg-gray-800 rounded-md truncate">What's your name?</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatSVG from './icons/chat.svg'

</script>