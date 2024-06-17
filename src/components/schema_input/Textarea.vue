<template>
    <textarea v-model="model" class="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 rounded-md p-2 border border-gray-400"></textarea>
</template>

<script setup lang="ts">
const model = defineModel<string>({
    required: true
})
</script>