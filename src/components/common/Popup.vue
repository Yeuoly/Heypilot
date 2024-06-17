<template>
    <div @click="open" ref="hover">
        <slot name="placeholder"></slot>
        <div v-if="show" class="absolute" :style="{
            width: `${width}px`,
            height: `${height}px`,
            top: `${position.y}px`,
            left: `${position.x}px`
        }">
            <slot  name="popup"> </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const show = ref(false)
const position = ref({
    x: 0, y: 0
})

const props = defineProps({
    width: {
        type: Number,
        default: 240
    },
    height: {
        type: Number,
        default: 400
    }
})

const hover = ref<HTMLDivElement | null>(null)

const open = async () => {
    // get current position
    const rect = hover.value?.getBoundingClientRect()
    if (!rect) {
        return
    }

    if (show.value) {
        show.value = false
        return
    }

    // if rect.x + width > window.innerWidth, then move the popup to the left, aligning the right edge of the popup with the right edge of the button
    if (rect.x + props.width + 30 > window.innerWidth) {
        position.value = {
            x: rect.x - props.width + rect.width,
            y: rect.y + rect.height
        }
    } else {
        position.value = {
            x: rect.x,
            y: rect.y + rect.height
        }
    }

    show.value = true
}

const onClickOtherWhere = (e: MouseEvent) => {
    if (hover.value && !hover.value.contains(e.target as Node)) {
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