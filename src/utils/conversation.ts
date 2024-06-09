import { changeToSlideMode } from "./window"

export const startNewConversation = async (screenshot?: string) => {
    changeToSlideMode(screenshot)
}

export const continueConversation = async (screenshot?: string) => {
    changeToSlideMode(screenshot)
}
