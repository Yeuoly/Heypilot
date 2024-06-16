import { EventEmitter } from 'events'

export const SetupModelEvent = new EventEmitter()

export const SetupModel = (provider: string) => {
    SetupModelEvent.emit('setup', provider)
}