import { currentMonitor } from "@tauri-apps/api/window"
import { router } from "../router"
import { SLIDE_MODE_WINDOW_SIZE, moveWindow, resizeWindow, setNotOnTop, setOnTop } from "./window"

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
    await resizeWindow(SLIDE_MODE_WINDOW_SIZE.width, SLIDE_MODE_WINDOW_SIZE.height)
    await moveWindow(size.width - SLIDE_MODE_WINDOW_SIZE.width, 0)
    await setOnTop()
}

export const changeToNormalMode = async () => {
    const monitor = await currentMonitor()
    const size = monitor?.size
    if (!size) {
        return
    }
    router.push('/chat')
    await resizeWindow(size.width, size.height)
    await moveWindow(0, 0)
    await setNotOnTop()
}