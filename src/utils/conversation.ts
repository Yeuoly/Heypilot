import { changeToSlideMode } from "./chat_mode"
import { EventEmitter } from 'events'

const conversationContext ={
    context: '',
    screenshot: ''
}

export const conversationEvent = new EventEmitter()

export const setupReplaceConversationEventListeners = (
    onReplace: () => void
) => {
    conversationEvent.on('replace', onReplace)
}

export const removeReplaceConversationEventListeners = (
    onReplace: () => void
) => {
    conversationEvent.off('replace', onReplace)
}

const emitReplaceConversationEvent = () => {
    conversationEvent.emit('replace')
}

export const getConversationContext = () => {
    return conversationContext
}

export const startNewConversation = async (context?: string, screenshot?: string) => {
    conversationContext.context = context || ''
    conversationContext.screenshot = screenshot || ''
    emitReplaceConversationEvent()
    changeToSlideMode(screenshot)
}

export const continueConversation = async (context?: string, screenshot?: string) => {
    conversationContext.context = context || ''
    conversationContext.screenshot = screenshot || ''
    emitReplaceConversationEvent()
    changeToSlideMode(screenshot)
}
