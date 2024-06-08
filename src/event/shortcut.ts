import { isRegistered, register } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { screenShot } from '../utils/screenshot'
import { continueConversation, startNewConversation } from '../utils/conversation'

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const registerShortcut = async (shortcut: string, action: () => void) => {
            if (!await isRegistered(shortcut)) {
                register(shortcut, action);
            }
        };
    
        const screenshotAndAction = async (action: (string?: string) => void) => {
            const size = await appWindow.outerSize();
            const screenshot = await screenShot({
                x: 0,
                y: 0,
                width: size.width,
                height: size.height
            });
            action(screenshot || undefined);
        };
    
        await registerShortcut('CommandOrControl+Shift+\'', async () => {
            startNewConversation();
        });
    
        await registerShortcut('CommandOrControl+Shift+/', async () => {
            await screenshotAndAction(startNewConversation);
        });
    } catch (e) {
        // trace back
        console.error(e)
    }
})