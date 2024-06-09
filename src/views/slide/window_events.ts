import { appWindow } from "@tauri-apps/api/window"
import { Ref, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { FetchImage } from "../../utils/tauri_command"
import { listen } from "@tauri-apps/api/event"
import { Event } from "../../event/enum"

export const useActiveMonitor = (onHideClick: () => void) => {
    const timer = ref<any>(null)
    const active = ref(true)
    const text = ref('')

    const startActiveTimer = () => {
        timer.value = setInterval(async () => {
            if (!active.value) {
                if (!await appWindow.isFocused()) {
                    onHideClick()
                }
            }
            active.value = false
        }, 6000)
    }
    
    watch(() => text, () => {
        active.value = true
    })

    onMounted(() => {
        startActiveTimer()
    })

    const onMouseMove = () => {
        active.value = true
    }

    return { text, onMouseMove }
}

export const useGlobalImageEvent = () => {
    const route = useRoute()
    const attachImages = ref<string[]>([])
    const imagePaths = ref<string[]>([])

    watch(() => imagePaths, async () => {
        attachImages.value = []
        for (const image of imagePaths.value) {
            attachImages.value.push(await FetchImage(image))
        }
    }, { deep: true, immediate: true })

    watch(() => route.query, async () => {
        const image = route.query.image as string
        imagePaths.value = []
        if (image) {
            imagePaths.value.push(image)
        }
    }, { deep: true, immediate: true })

    return { attachImages, imagePaths }
}

export const useGlobalEvent = (inputContainer: Ref<HTMLInputElement | null>) => {
    const focusInput = () => {
        inputContainer.value?.focus()
    }

    onMounted(async () => {
        focusInput()
        onUnmounted(await listen(Event.EVENT_SLIDE_FOCUS_INPUT, () => {
            focusInput()
        }))
    })
}