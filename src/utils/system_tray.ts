import { emit, listen } from '@tauri-apps/api/event'
import { ClearSystemTrayInf, ClickSystemTrayInf, SetupSystemTrayInf, SystemTrayClickEvent, SystemTrayItem } from './types'
import { Event } from '../event/enum'

class SystemTrayScenarios {
    current_items: SystemTrayItem[] = []
    listeners: ClickSystemTrayInf[] = []

    constructor() {
        this.current_items = []
        this.listeners = []
        listen<SystemTrayClickEvent>(Event.EVENT_TRAY_CLICK, event => {
            const item = this.current_items.find(i => i.id === event.payload.id)
            for (const listener of this.listeners) {
                if (item) {
                    listener(item)
                }
            }
        })
    }
    
    Setup: SetupSystemTrayInf = (items) => {
        // clear the current items
        this.current_items.splice(0, this.current_items.length)
        // add the new items
        this.current_items.push(...items)
        emit(Event.EVENT_REFRESH_TRAY_ITEMS, items)
    }

    Clear: ClearSystemTrayInf = () => {
        // clear the current items
        this.current_items.splice(0, this.current_items.length)
        emit(Event.EVENT_REFRESH_TRAY_ITEMS, [])
    }

    SetClickHandler = (handler: ClickSystemTrayInf) => {
        this.listeners.push(handler)
    }

    ClearClickHandler = () => {
        this.listeners.splice(0, this.listeners.length)
    }
}

export const systemTrayScenarios = new SystemTrayScenarios()

