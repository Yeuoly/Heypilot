import { appWindow, PhysicalPosition, PhysicalSize } from '@tauri-apps/api/window'

export const SLIDE_MODE_WINDOW_SIZE = {
    width: 800,
    height: 1200
}

export const setOnTop = async () => {
    await appWindow.setAlwaysOnTop(true)
}

export const setNotOnTop = async () => {
    await appWindow.setAlwaysOnTop(false)
}

export const moveWindow = async (x: number, y: number) => {
    await appWindow.setPosition(new PhysicalPosition(x, y))
}

export const resizeWindow = async (width: number, height: number) => {
    await appWindow.setSize(new PhysicalSize(width, height))
}

export const hideWindow = () => {
    appWindow.hide()
}

export const hideBar = async () => {
    await appWindow.setDecorations(false)
}

export const showBar = async () => {
    await appWindow.setDecorations(true)
}

export const showApp = async () => {
    await appWindow.show()
}

export const hideApp = async () => {
    await appWindow.hide()
}