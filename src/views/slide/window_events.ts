import { appWindow } from "@tauri-apps/api/window"
import { Ref, onMounted, onUnmounted, ref, watch } from "vue"
import { FetchImage } from "../../utils/image"
import { listen } from "@tauri-apps/api/event"
import { Event } from "../../event/enum"
import { useChatContext } from "../../utils/context"

export const useActiveMonitor = (text: Ref<string>, messages: Ref<any>, onHideClick: () => void) => {
    const { context } = useChatContext()
    const timer = ref<any>(null)
    const active = ref(true)

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

    watch(() => context, () => {
        active.value = true
    })

    watch(() => messages, () => {
        active.value = true
    }, { deep: true })

    onMounted(() => {
        startActiveTimer()
    })

    onUnmounted(() => {
        clearInterval(timer.value)
    })

    const onMouseMove = () => {
        active.value = true
    }

    return { text, onMouseMove }
}

export const useGlobalContext = () => {
    const { context } = useChatContext()
    const attachImages = ref<string[]>([])
    const imagePaths = ref<string[]>([])
    const text = ref('')

    watch(() => imagePaths, async () => {
        attachImages.value = []
        for (const image of imagePaths.value) {
            attachImages.value.push(await FetchImage(image))
        }
    }, { deep: true, immediate: true })

    watch(() => context, () => {
        if (context.value.screenshot) {
            imagePaths.value = [context.value.screenshot]
        } else {
            imagePaths.value = []
        }
    }, { deep: true, immediate: true })

    return { text, context, attachImages, imagePaths }
}

export const useGlobalEvent = (inputContainer: Ref<HTMLInputElement | null>) => {
    const focusInput = () => {
        inputContainer.value?.focus()
    }

    let focusInputUnset: () => void

    onMounted(async () => {
        focusInputUnset = await listen(Event.EVENT_SLIDE_FOCUS_INPUT, () => {
            focusInput()
        })

        focusInput()
    })

    onUnmounted(() => {
        if (focusInputUnset) {
            focusInputUnset()
        }
    })
}