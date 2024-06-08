import { AssistantPromptMessage, PromptMessage } from "./entities"

export enum LLMMode {
    CHAT = 'chat',
    COMPLETION = 'completion',
}

export interface LLMUsage {
    prompt_tokens: number
    prompt_unit_price: number
    prompt_price_unit: number
    prompt_price: number
    completion_tokens: number
    completion_unit_price: number
    completion_price_unit: number
    completion_price: number
    total_tokens: number
    total_price: number
    currency: string
    latency: number
}

export interface LLMResultChunkDelta {
    index: number
    message: AssistantPromptMessage
    usage?: LLMUsage
    finish_reason?: string
}

export interface LLMResultChunk {
    model: string
    prompt_messages: PromptMessage[],
    system_fingerprint?: string,
    delta: LLMResultChunkDelta
}