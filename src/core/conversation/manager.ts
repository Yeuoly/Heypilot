import { Conversation } from "./conversation"
import { ModelConfig } from "./entities"

export namespace ConversationManager {
    export const GetNewConversation = (model_config: ModelConfig): Conversation => {
        return new Conversation([], model_config)
    }

    export const GetConversation = (id: string): Conversation => {
        return new Conversation([], { provider: '', model: '' })
    }
}