<template>
<div ref="select" class="rounded-md cursor-pointer border border-gray-500 flex items-center" @click="open">
    <div>
        <Model class="w-6 mx-2" />
    </div>
    <div class="flex-grow truncate">
        {{ model.model }}
    </div>
    <div>
        <Menu class="w-5 mx-2" />
    </div>
    <div :style="{
        display: show ? 'block' : 'none',
        position: 'absolute',
        top: position.y + 'px',
        left: position.x + 'px',
        width: '300px'
    }" class="bg-background rounded-md p-2 shadow shadow-[#000]" @click="show = false">
        <div class="text-white mb-2">Model Configuration</div>
        <ModelSelector v-model:model="model.model" v-model:provider="model.provider" />
    </div>
</div>
</template>

<script setup lang="ts">
import { ModelConfig } from '../../core/scenario/entities'
import Model from './icons/model.svg'
import Menu from './icons/menu.svg'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ModelManager } from '../../core/model_runtime/model_manager'
import ModelSelector from './ModelSelector.vue'

const select = ref<HTMLDivElement>()
const show = ref(false)
const position = ref({
    x: 0, y: 0
})

const model = defineModel<ModelConfig>({
    required: true
})

const open = () => {
    // get current position
    const rect = select.value?.getBoundingClientRect()
    if (!rect) {
        return
    }

    if (show.value) {
        show.value = false
        return
    }

    position.value = {
        x: rect.left,
        y: rect.top + rect.height + 8
    }

    show.value = true
}

const onClickOtherWhere = (e: MouseEvent) => {
    if (!select.value) {
        return
    }

    if (!select.value.contains(e.target as Node)) {
        show.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', onClickOtherWhere)
})

onUnmounted(() => {
    document.removeEventListener('click', onClickOtherWhere)
})

</script>