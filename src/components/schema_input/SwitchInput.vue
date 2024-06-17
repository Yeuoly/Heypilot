<template>
    <!-- switch -->
    <div class="flex items-center">
        <div class="p-2 items-center text-center text-white w-1/2 bg-gray-900 rounded-lg
            cursor-pointer"
            :class="{
                'border': model,
            }"
            @click.stop="model = !model"
            >
                {{ props.enabled_label }}
        </div>
        <div class="p-2 items-center text-center text-white w-1/2 bg-gray-900 rounded-lg
            cursor-pointer"
            :class="{
                'border': !model,
            }"
            @click.stop="model = !model"
            >
                {{ props.disabled_label }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    enabled_label: {
        type: String,
        default: 'Enabled'
    },
    disabled_label: {
        type: String,
        default: 'Disabled'
    },
})

const model = defineModel<boolean>({
    required: true
})
</script>