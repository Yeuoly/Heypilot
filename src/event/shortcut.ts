import { isRegistered, register } from '@tauri-apps/api/globalShortcut'
import { SyncReplaceContext } from '../utils/context';
import { changeToSlideMode } from '../utils/chat';

window.addEventListener('DOMContentLoaded', async () => {
    try {
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