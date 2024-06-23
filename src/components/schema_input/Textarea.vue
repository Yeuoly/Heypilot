<template>
    <div class="h-full flex flex-col border border-gray-300 bg-gray-700 rounded-lg
        bg-gray-700
    "
        :class="{
            'dark:border-blue-500': focus,
            'border-gray-500': outline,
            'border-transparent': !outline
        }"
    >
        <div v-if="label" class="flex justify-between pl-3 py-2 bg-backgroundSecondary rounded-t-lg">
            <div class="text-sm">
                {{ label }}
            </div>
            <slot></slot>
        </div>
        <textarea v-model="model" class="flex-grow w-full block p-2.5 w-full text-sm text-gray-900 
            rounded-lg bg-gray-700 focus:outline-none
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
        "
            @focusin="focus = true"
            @focusout="focus = false"
        >
        </textarea>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<string>({
    required: true
})

const focus = ref(false)

const props = defineProps({
    outline: {
        type: Boolean,
        default: true
    },
    label: {
        type: String,
        default: ''
    }
})
</script>