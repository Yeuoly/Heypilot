export interface ConversationHandle {
    id: string
}

export enum MessageFrom {
    USER = 'user',
    ASSISTANT = 'assistant'
}

export interface ModelConfig {
    provider: string
    model: string
}