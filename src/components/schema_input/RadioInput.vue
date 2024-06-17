<template>
    <div class="flex items-center mr-2">
        <div class="mr-2 p-2 items-center text-center text-white w-1/2 bg-gray-900 rounded-lg
            cursor-pointer"
            v-for="option in options"
            :class="child_class(option.value)"
            @click="model = option.value"
            >
                {{ option.label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'

const child_class = computed(() => {
    return (value: string) => {
        const cls: any = {
            'border': model.value == value
        }

        for (const c of props.child_class) {
            cls[c] = true
        }

        return cls
    }
})

const props = defineProps({
    options: {
        type: Array as PropType<{
            label: string,
            value: string
        }[]>,
    },
    child_class: {
        type: Array as PropType<string[]>,
        default: []
    }
})

const model = defineModel<string>({
    required: true
})
</script>