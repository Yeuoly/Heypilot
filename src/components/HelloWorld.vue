<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h1 class="text-2xl font-bold text-gray-800">123</h1>
    <p class="text-gray-600">Count: {{ count }}</p>
    <button @click="count++" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Increment</button>
    <p class="read-the-docs">For more information visit <a href="https://v3.vuejs.org" target="_blank">Vue 3 Docs</a></p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
