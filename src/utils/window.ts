import { emit } from '@tauri-apps/api/event'
import { currentMonitor, appWindow } from '@tauri-apps/api/window'
import { MoveToAndSetOnTopPayload } from './types'
import { Event } from '../event/enum'
import { router } from '../router/index'

const SLIDE_MODE_WINDOW_SIZE = {
    width: 800,
    height: 1200
}

export const changeToSlideMode = async (image?: string) => {
    // get monitor size
    const monitor = await currentMonitor()
    const size = monitor?.size
    if (!size) {
        return
    }
    router.push({
        path: '/slide',
        query: {
            image
        }
    })
    emit(Event.EVENT_MOVE_TO_AND_SET_ON_TOP, {
        x: size.width - SLIDE_MODE_WINDOW_SIZE.width,
        y: 0,
        width: SLIDE_MODE_WINDOW_SIZE.width,
        height: SLIDE_MODE_WINDOW_SIZE.height
    } as MoveToAndSetOnTopPayload)
}

export const changeToNormalMode = async () => {
    const monitor = await currentMonitor()
    const size = monitor?.size
    if (!size) {
        return
    }
    router.push('/chat')
    emit(Event.EVENT_MOVE_TO_AND_SET_ON_TOP, {
        x: 0,
        y: 0,
        width: size.width,
        height: size.height
    } as MoveToAndSetOnTopPayload)
    emit(Event.EVENT_SET_NOT_ON_TOP, {})
}

export const hideWindow = () => {
    appWindow.hide()
}
