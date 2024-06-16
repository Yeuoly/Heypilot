import { PromptMessage, PromptMessageContent, PromptMessageContentType, PromptMessageImageContent, PromptMessageImageContentDetail, PromptMessageRole, PromptMessageTool } from "../model_runtime/__base/entities"
import { LLMResultChunk } from "../model_runtime/__base/llm_entities"
import { ModelManager } from "../model_runtime/model_manager"
import { MessageFrom, ModelConfig } from "./entities"
import { Message } from "./message"
import { EventEmitter } from 'events'

export class EventListenerState<T> {
    running: boolean
    results: T[]

    constructor(event: EventEmitter) {
        this.running = true
        this.results = []

        event.on('message', (message: T) => {
            this.results.push(message)
        })
    }

    async *listen() {
        while(this.running) {
            if (this.results.length > 0) {
                yield this.results.shift()
            } else {
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        }
    }

    stop() {
        this.running = false
    }
}

export class Conversation {
    histories: Message[]
    config: ModelConfig
    event: EventEmitter
    
    constructor(histories: Message[] = [], model_config: ModelConfig) {
        this.histories = histories
        this.config = model_config
        this.event = new EventEmitter()
    }

    async StartConversation(context: string, text: string, images: string[]) {
        const self = this
        const model_instance = await ModelManager.GetModelInstance(this.config.provider, this.config.model)
        const credentials = {
            api_key: import.meta.env.VITE_OPENAI_KEY,
        }
        const prompt_messages: PromptMessage[] = [
            {
                role: PromptMessageRole.SYSTEM,
                content: 'You are a helpful assistant, following is the context of the conversation:'
                    + context
            }, 
        ]

        const user_message = new Message('', MessageFrom.USER, text, new Date().getTime(), images)

        for (const history of this.histories.concat(user_message)) {
            if (history.from === MessageFrom.USER) {
                if (history.images.length > 0) {
                    const content: PromptMessageContent[] = []
                    for (const image of await history.FetchImages()) {
                        content.push({
                            type: PromptMessageContentType.IMAGE,
                            data: image,
                            detail: PromptMessageImageContentDetail.LOW
                        } as PromptMessageImageContent)
                    }
                    content.push({
                        type: PromptMessageContentType.TEXT,
                        data: history.content
                    })
                    prompt_messages.push({
                        role: PromptMessageRole.USER,
                        content: content
                    })
                } else {
                    prompt_messages.push({
                        role: PromptMessageRole.USER,
                        content: history.content
                    })
                }
            } else if (history.from === MessageFrom.ASSISTANT) {
                prompt_messages.push({
                    role: PromptMessageRole.ASSISTANT,
                    content: history.content
                })
            }
        }

        const model_parameters = {}
        const tools: PromptMessageTool[] = []
        const stop: string[] = []
        const SaveConversation = this.SaveConversation
        let full_text = ''

        model_instance.invoke(this.config.model, credentials, prompt_messages, model_parameters, tools, stop,
            [{
                onMessage(message: LLMResultChunk) {
                    // push message to event
                    self.event.emit('message', message)
                    // update full text
                    full_text += message.delta.message.content || ''
                },
                onEnd() {
                    // push full text to message
                    const assistant_message = new Message('', MessageFrom.ASSISTANT, full_text, new Date().getTime(), [])
                    self.histories.push(user_message)
                    self.histories.push(assistant_message)
                    SaveConversation()
                },
                onError(e) {
                    
                }
            }]
        )
    }

    async SaveConversation() {}

    ConnectEvent() {
        return new EventListenerState<LLMResultChunk>(this.event)
    }

    ListMessages() {
        return this.histories
    }
}