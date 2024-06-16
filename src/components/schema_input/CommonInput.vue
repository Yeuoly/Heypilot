<template>
    <div>
        <input v-model="model" :placeholder="placeholder"
            :type="type"
            class="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 border-b border-gray-400" />
    </div>
</template>

<script setup lang="ts">
import { InputTypeHTMLAttribute, PropType } from 'vue'

const model = defineModel<string>({
    required: true
})

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Type your text'
    },
    type: {
        type: String as PropType<InputTypeHTMLAttribute>,
        default: 'text',
        required: true,
    }
})
</script>