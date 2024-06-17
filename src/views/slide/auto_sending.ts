import { Ref, onMounted, onUnmounted, watch } from "vue"
import { ScenarioManager } from "../../core/scenario/scenario_manager"
import { removeChatContextReplaceCompletedListener, setChatContextReplaceCompletedListener } from "../../utils/context"

export const useAutoSending = (context: Ref<{
    context: string
    screenshot: string
}>, text: Ref<string>, sendMessage: () => void) => {
    let timer: any = null

    const { currentScenario } = ScenarioManager.useScenario()

    const autoSend = () => {
        if (!context.value.context && !text.value) {
            return
        }
        if (!currentScenario.value.advanced_setting.auto_commit) {
            return
        }

        clearTimeout(timer)
        timer = setTimeout(() => {
            sendMessage()
        }, 300)
    }

    onMounted(() => {
        setChatContextReplaceCompletedListener(autoSend)
    })

    onUnmounted(() => {
        removeChatContextReplaceCompletedListener(autoSend)
    })

}

export const useAutoNewConversation = (context: Ref<{
    context: string
    screenshot: string
}>, text: Ref<string>, messages: Ref<{
    role: 'user' | 'assistant',
    content: string | any[],
    marked_content: string,
    images: string[]
}[]>) => {
    watch(() => [context.value.context], () => {
        // clear messages
        messages.value = []
    }, { immediate: true })
}