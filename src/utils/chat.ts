import { currentMonitor } from "@tauri-apps/api/window"
import { router } from "../router"
import { SLIDE_MODE_WINDOW_SIZE, hideBar, resizeWindow, setNotOnTop, setOnTop, showApp, showBar } from "./window"

export const changeToSlideMode = async () => {
    // get monitor size
    const monitor = await currentMonitor()
    const size = monitor?.size
    if (!size) {
        return
    }
    router.push('/slide')
    hideBar()
    resizeWindow(SLIDE_MODE_WINDOW_SIZE.width, SLIDE_MODE_WINDOW_SIZE.height)
    setOnTop()
    showApp()
}

export const changeToNormalMode = async () => {
    const monitor = await currentMonitor()
    const size = monitor?.size
    if (!size) {
        return
    }
    router.push('/chat')
    resizeWindow(size.width, size.height)
    setNotOnTop()
    showBar()
    showApp()
}