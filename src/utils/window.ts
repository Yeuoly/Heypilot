import { appWindow, LogicalSize, LogicalPosition } from '@tauri-apps/api/window'

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
    await appWindow.setPosition(new LogicalPosition(x, y))
}

export const resizeWindow = async (width: number, height: number) => {
    await appWindow.setSize(new LogicalSize(width, height))
}

export const hideWindow = () => {
    appWindow.hide()
}
