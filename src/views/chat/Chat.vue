<template>
  <div class="flex h-screen bg-black text-white">
    <div class="w-1/5 bg-gray-950 p-4 pt-2">
      <History />
    </div>
    <div class="flew-grow bg-gray-800 flex flex-col space-y-4 w-full">
      <div class="flex-grow overflow-y-auto">
        <Messages />
      </div>
      <div class="my-4 w-full px-2 pb-4">
        <Editor />
      </div>
    </div>
    <div class="w-1/5 bg-gray-800 p-4 overflow-y-auto">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import History from './History.vue'
import Editor from './Editor.vue'
import Messages from './Messages.vue'


</script>