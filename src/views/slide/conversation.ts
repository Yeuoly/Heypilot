import { Ref, onMounted, ref } from "vue"
import { Conversation } from "../../core/conversation/conversation"
import { ConversationManager } from "../../core/conversation/manager"
import { MessageFrom } from "../../core/conversation/entities"
import { FetchImage } from "../../utils/tauri_command"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { Buffer } from 'buffer'
import hljs from "highlight.js"
import "highlight.js/styles/atom-one-dark.css"

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

export const useConversation = (messageContainer: Ref<HTMLElement | null>, text: Ref<string>, images: Ref<string[]>) => {
    let conversation: Conversation | null = null
    const messages = ref<{
        role: 'user' | 'assistant',
        content: string | any[],
        marked_content: string,
        images: string[]
    }[]>([])

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

    const sendMessage = async () => {
        if (!conversation) {
            return
        }

        const event = conversation.ConnectEvent()
        conversation.StartConversation(text.value, images.value)

        // add user message
        messages.value.push({
            role: 'user',
            content: text.value,
            images: await Promise.all(images.value.map(async (image) => await FetchImage(image))),
            marked_content: await marked.parse(text.value)
        })

        text.value = ''
        images.value = []

        try {
            for await (const message of event.listen()) {
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

                console.log(messageContainer)
                messageContainer.value?.scrollTo({
                    top: messageContainer.value.scrollHeight,
                })
            }

            refreshMessages()
        } finally {
            event.stop()
        }
    }

    onMounted(async () => {
        conversation = ConversationManager.GetNewConversation({
            provider: 'openai', model: 'gpt-4o'
        })
    })

    return {
        messages,
        sendMessage
    }
}