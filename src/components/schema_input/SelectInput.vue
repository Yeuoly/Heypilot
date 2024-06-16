<template>
    <select v-model="model" class="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 border-b border-gray-400">
        <option v-for="option in props.options" :value="option.value">{{ option.label }}</option>
    </select>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const model = defineModel<string>({
    required: true
})

const props = defineProps({
    options: {
        type: Array as PropType<{ label: string, value: string }[]>,
    }
})
</script>