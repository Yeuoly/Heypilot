import { PromptMessage, PromptMessageContentType, PromptMessageImageContent, PromptMessageRole, PromptMessageTool } from "../../__base/entities"
import { LargeLanguageModel, MessageCallback } from "../../__base/large_language_model"
import OpenAI from 'openai'


export default class OpenAILargeLanguageModel extends LargeLanguageModel {
    _invoke(model: string, credentials: { [key: string]: string; }, 
        prompt_messages: PromptMessage[], model_parameters: { [key: string]: any; }, 
        tools?: PromptMessageTool[] | undefined, stop?: string[] | undefined, 
        callbacks?: MessageCallback[] | undefined): void {
        const openai = new OpenAI({
            baseURL: credentials['base_url'] || 'https://api.openai.com/v1',
            apiKey: credentials['api_key'],
            dangerouslyAllowBrowser: true
        })

        this._invoke_openai(model, openai, prompt_messages, model_parameters, tools, stop, callbacks)
    }

    async _invoke_openai(model: string, openai: OpenAI, 
        prompt_messages: PromptMessage[], model_parameters: { [key: string]: any; }, 
        tools?: PromptMessageTool[] | undefined, stop?: string[] | undefined, 
        callbacks?: MessageCallback[] | undefined) {
        const messages = prompt_messages.map(v => {
            if (v.role == PromptMessageRole.USER) {
                if (typeof v.content == 'string') {
                    return {
                        role: 'user',
                        content: v.content
                    }
                }

                const sub_messages = []
                for (const content of v.content) {
                    if (content.type == PromptMessageContentType.TEXT) {
                        sub_messages.push({
                            type: 'text',
                            text: content.data
                        })
                    } else {
                        sub_messages.push({
                            type: 'image_url',
                            image_url: {
                                url: content.data,
                                detail: (content as PromptMessageImageContent).detail
                            }
                        })
                    }
                }

                return {
                    role: 'user',
                    content: sub_messages
                }
            } else if (v.role == PromptMessageRole.ASSISTANT) {
                return {
                    role: 'assistant',
                    content: v.content
                }
            } else if (v.role == PromptMessageRole.SYSTEM) {
                return {
                    role: 'system',
                    content: v.content
                }
            }
        })

        const stream = await openai.chat.completions.create({
            model: model,
            messages: messages as any,
            stream: true,
            ...model_parameters
        })
        for await (const chunk of stream) {
            for (const choice of chunk.choices) {
                callbacks?.forEach((c) => {
                    c.onMessage({
                        model: model,
                        prompt_messages: prompt_messages,
                        delta: {
                            index: choice.index,
                            message: {
                                role: PromptMessageRole.ASSISTANT,
                                content: choice.delta.content as string,
                            },
                        },
                        system_fingerprint: chunk.system_fingerprint,
                    })
                })
            }
        }
        callbacks?.forEach((c) => {
            c.onEnd()
        })
    }
}