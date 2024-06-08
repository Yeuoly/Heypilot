import { isRegistered, register } from '@tauri-apps/api/globalShortcut'
import { screenShot } from '../utils/screenshot'
import { changeToSlideMode } from '../utils/window'

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const registered = await isRegistered('Shift+/')
        if (!registered) {
            register('Shift+/', async () => {
                const screenshot = await screenShot({
                    x: 0,  y: 0,
                    width: window.innerWidth, height: window.innerHeight
                });

                // start a new chat process
                changeToSlideMode()
            })
        }
    } catch (e) {
        // trace back
        console.error(e)
    }
})