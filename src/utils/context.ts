import { EventEmitter } from 'events'
import { Ref, inject } from 'vue'
import { emit, listen } from "@tauri-apps/api/event"
import { Event } from "../event/enum"
import { ReplaceContextWithSelectionResponse } from "./types"
import { screenShot } from './screenshot'
import { appWindow } from '@tauri-apps/api/window'

export const contextEvent = new EventEmitter()

export const setChatContext = (context?: string, screenshot?: string) => {
    contextEvent.emit('setContext', context, screenshot)
}

export const setChatTextContext = (context: string) => {
    contextEvent.emit('setText', context)
}

export const setChatScreenshotContext = (screenshot: string) => {
    contextEvent.emit('setScreenshot', screenshot)
}

export const setChatContextListener = (listener: (context?: string, screenshot?: string) => void) => {
    contextEvent.on('setContext', listener)
}

export const setChatTextContextListener = (listener: (context: string) => void) => {
    contextEvent.on('setText', listener)
}

export const setChatScreenshotContextListener = (listener: (screenshot: string) => void) => {
    contextEvent.on('setScreenshot', listener)
}

export const setChatContextReplaceCompletedListener = (listener: () => void) => {
    contextEvent.on('replaceCompleted', listener)
}

export const removeChatContextReplaceCompletedListener = (listener: () => void) => {
    contextEvent.off('replaceCompleted', listener)
}


export const setChatContextReplaceCompleted = () => {
    contextEvent.emit('replaceCompleted')
}

export const useChatContext = () => {
    const context = inject<Ref<{
        context: string
        screenshot: string
    }>>('chat_context')

    if (!context) {
        throw new Error('useChatContext must be used within a ChatContextProvider')
    }

    return {
        context
    }
}

export const SyncReplaceContext = async (screenshot: boolean) => {
    emit(Event.EVENT_REPLACE_CONTEXT_WITH_SELECTION, {})

    let count = 1

    const unset = await listen<ReplaceContextWithSelectionResponse>(
        Event.EVENT_REPLACE_CONTEXT_WITH_SELECTION_RESPONSE, 
        async (event) => {
            unset()
            setChatTextContext(event.payload.selection)
            count -= 1
        }
    )

    if (screenshot) {
        count += 1
        setTimeout(async () => {
            const size = await appWindow.outerSize();
            const screenshot = await screenShot({
                x: 0,
                y: 0,
                width: size.width,
                height: size.height
            })
            if (screenshot) {
                setChatScreenshotContext(screenshot)
            }
            count -= 1
        })
    }

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (count === 0) {
                clearInterval(interval)
                resolve(true)

                contextEvent.emit('replaceCompleted')
            }
        }, 100)
    })
}