import { systemTrayScenarios } from './system_tray'
import { ClickSystemTrayInf, SystemTrayItem } from './types'

export namespace SystemTrayManager {
    export type Scenarios = SystemTrayItem
    
    export const SetEventListeners = (handler: ClickSystemTrayInf) => {
        systemTrayScenarios.SetClickHandler(handler)
    }

    export const ClearEventListeners = () => {
        systemTrayScenarios.ClearClickHandler()
    }

    const scenarios: Scenarios[] = []

    export const Setup = (items: Scenarios[]) => {
        systemTrayScenarios.Setup(items)
        scenarios.push(...items)
    }

    export const Clear = () => {
        systemTrayScenarios.Clear()
        scenarios.splice(0, scenarios.length)
    }

    export const List = () => {
        return scenarios
    }

    export const Get = (id: string) => {
        return scenarios.find(item => item.id === id)
    }

    export const Remove = (id: string) => {
        const index = scenarios.findIndex(item => item.id === id)
        if (index !== -1) {
            scenarios.splice(index, 1)
        }

        systemTrayScenarios.Setup(scenarios)
    }

    export const Add = (item: Scenarios) => {
        scenarios.push(item)
        systemTrayScenarios.Setup(scenarios)
    }

    export const Update = (item: Scenarios) => {
        const index = scenarios.findIndex(i => i.id === item.id)
        if (index !== -1) {
            scenarios[index] = item
        }

        systemTrayScenarios.Setup(scenarios)
    }

    export const Active = (id: string) => {
        // deactivate all items
        for (const item of scenarios) {
            item.active = false
        }

        // activate the item
        const item = scenarios.find(i => i.id === id)
        if (item) {
            item.active = true
        }

        systemTrayScenarios.Setup(scenarios)
    }
}