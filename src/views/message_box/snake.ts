import { inject } from "vue"

export type OpenSnakeMessagePayload = {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
}

export const useSnakeMessage = () => {
    const openSnakeMessage = inject<(p: OpenSnakeMessagePayload) => void>('openSnakeMessage')

    if (!openSnakeMessage) {
        throw new Error('useSnakeMessage must be used under SnakeMessageProvider')
    }

    return {
        openSnakeMessage
    }
}