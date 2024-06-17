import { Ref, onMounted, ref } from "vue"
import { Conversation } from "../../core/conversation/conversation"
import { ConversationManager } from "../../core/conversation/manager"
import { MessageFrom } from "../../core/conversation/entities"
import { FetchImage } from "../../utils/image"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { Buffer } from 'buffer'
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-dark.css"
import { useChatContext } from "../../utils/context"
import { ScenarioManager } from "../../core/scenario/scenario_manager"
import { useSnakeMessage } from "../message_box/snake"

window.Buffer = Buffer

const marked = new Marked(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        const rendered = hljs.highlight(code, { language }).value
        const b64encodedCode = Buffer.from(code).toString('base64')
        return `<div style="background: gray; text-align: center; margin-bottom: 8px;" 
            class="w-10 text-white rounded cursor-pointer" 
            onclick="copyToClipboard('${b64encodedCode}')">Copy</div><div>${rendered}</div>`
    }
}))

export const useConversation = (
    messageContainer: Ref<HTMLElement | null>, 
    text: Ref<string>, 
    images: Ref<string[]>
) => {
    let conversation: Conversation | null = null
    const messages = ref<{
        role: 'user' | 'assistant',
        content: string | any[],
        marked_content: string,
        images: string[]
    }[]>([])

    const { context } = useChatContext()

    const refreshMessages = async () => {
        messages.value = []
        const messageList = conversation?.ListMessages()
        if (!messageList) {
            return
        }

        for (const message of messageList) {
            messages.value.push({
                role: message.from === MessageFrom.USER ? 'user' : 'assistant',
                content: message.content,
                images: message.images,
                marked_content: await marked.parse(message.content)
            })
        }
    }

    const { openSnakeMessage } = useSnakeMessage()

    let running = false
    const { currentScenario } = ScenarioManager.useScenario()
    const sendMessage = async () => {
        if (!conversation) {
            return
        }
        
        if (running) {
            return
        }

        running = true

        const { 
            user_message, system_message
        } = ScenarioManager.formatScenario(currentScenario.value, text.value, context.value.context)

        conversation.StartConversation(system_message, user_message, images.value)

        // add user message
        messages.value.push({
            role: 'user',
            content: user_message,
            images: await Promise.all(images.value.map(async (image) => await FetchImage(image))),
            marked_content: await marked.parse(user_message)
        })

        setTimeout(() => {
            messageContainer.value?.scrollTo({
                top: messageContainer.value.scrollHeight,
            })
        })

        text.value = ''
        images.value = []
    }

    onMounted(async () => {
        conversation = ConversationManager.GetNewConversation({
            provider: 'openai', model: 'gpt-4o'
        })
        const event = conversation.ConnectEvent()

        try {
            for await (const message of event.listen()) {
                if (message == 'message_end') {
                    running = false
                    continue
                }

                const last_idx = messages.value.length - 1
                if (last_idx < 0) {
                    continue
                }

                if (messages.value[last_idx].role === 'user') {
                    messages.value.push({
                        role: 'assistant',
                        content: message?.delta.message.content || '',
                        images: [],
                        marked_content: await marked.parse(message?.delta.message.content as string || '')
                    })
                } else {
                    messages.value[last_idx].content += message?.delta.message.content as string || ''
                    messages.value[last_idx].marked_content = await marked.parse(messages.value[last_idx].content as string || '')
                }

                messageContainer.value?.scrollTo({
                    top: messageContainer.value.scrollHeight,
                })
            }

            openSnakeMessage({
                message: 'end'
            })

            refreshMessages()
        } finally {
            event.stop()
        }
    })

    return {
        messages,
        sendMessage
    }
}