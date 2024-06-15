import { isRegistered, register } from '@tauri-apps/api/globalShortcut'
import { startNewConversation } from '../utils/conversation'
import { SyncReplaceContext } from '../utils/context';

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const registerShortcut = async (shortcut: string, action: () => void) => {
            if (!await isRegistered(shortcut)) {
                register(shortcut, action);
            }
        };
    
        const screenshotAndAction = async (action: () => void) => {
            SyncReplaceContext(true)
            action();
        };
    
        await registerShortcut('CommandOrControl+Shift+\'', async () => {
            SyncReplaceContext(false)
            startNewConversation()
        });
    
        await registerShortcut('CommandOrControl+Shift+/', async () => {
            await screenshotAndAction(startNewConversation)
        });
    } catch (e) {
        // trace back
        console.error(e)
    }
})