import { isRegistered, register } from '@tauri-apps/api/globalShortcut'
import { listen } from '@tauri-apps/api/event'
import { SyncReplaceContext } from '../utils/context';
import { changeToSlideMode } from '../utils/chat';
import { Event } from './enum';

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const listener = await listen<{
            round: number,
            position: Array<number>,
        }>(Event.EVENT_MOUSE_CIRCLE, (event) => {
            SyncReplaceContext(false)
            changeToSlideMode()
            // move window to the position
            window.moveTo(event.payload.position[0], event.payload.position[1])
        })

        const registerShortcut = async (shortcut: string, action: () => void) => {
            if (!await isRegistered(shortcut)) {
                register(shortcut, action)
            }
        };

        await registerShortcut('CommandOrControl+Shift+\'', async () => {
            SyncReplaceContext(false)
            changeToSlideMode()
        });
    
        await registerShortcut('CommandOrControl+Shift+/', async () => {
            SyncReplaceContext(true)
            changeToSlideMode()
        });
    } catch (e) {
        // trace back
        console.error(e)
    }
})