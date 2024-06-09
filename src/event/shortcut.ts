import { isRegistered, register } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { screenShot } from '../utils/screenshot'
import { startNewConversation } from '../utils/conversation'
import { GetSelection } from '../utils/selection'

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const registerShortcut = async (shortcut: string, action: () => void) => {
            if (!await isRegistered(shortcut)) {
                register(shortcut, action);
            }
        };
    
        const screenshotAndAction = async (action: (selection?: string, screen?: string) => void) => {
            const size = await appWindow.outerSize();
            const screenshot = await screenShot({
                x: 0,
                y: 0,
                width: size.width,
                height: size.height
            });
            const selection = await GetSelection()
            action(selection, screenshot || undefined);
        };
    
        await registerShortcut('CommandOrControl+Shift+\'', async () => {
            const selection = await GetSelection()
            startNewConversation(selection)
        });
    
        await registerShortcut('CommandOrControl+Shift+/', async () => {
            await screenshotAndAction(startNewConversation)
        });
    } catch (e) {
        // trace back
        console.error(e)
    }
})