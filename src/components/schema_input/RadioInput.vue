<template>
    <div class="flex">
        <div class="mr-2 p-2 items-center text-center text-white w-1/2 bg-gray-900 rounded-lg
            cursor-pointer"
            v-for="option in options"
            :class="{
                border: model == option.value,
            }"
            @click="model = option.value"
            >
                {{ option.label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
    options: {
        type: Array as PropType<{
            label: string,
            value: string
        }[]>,
    }
})

const model = defineModel<string>({
    required: true
})
</script>