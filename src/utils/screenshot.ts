import { emit, listen } from '@tauri-apps/api/event'
import { Event } from '../event/enum'
import { SystemScreenShotRequestPayload, SystemScreenShotResponsePayload } from './types'

// screenshot and return the path
export const screenShot = (payload: SystemScreenShotRequestPayload) => new Promise<string | null>(async (resolve, reject) => {
    payload.monitor = payload.monitor || 0

    emit(Event.EVENT_SCREENSHOT, payload)
    let timer = -1

    const unset = await listen<SystemScreenShotResponsePayload>(Event.EVENT_SCREENSHOT_RESPONSE, async (event) => {
        unset()
        if (timer !== -1) {
            clearTimeout(timer)
        }

        if (event.payload.error) {
            reject(event.payload.error)
        } else {
            resolve(event.payload.path)
        }
    })

    timer = setTimeout(() => {
        reject('timeout')
    }, 200000) as any
})