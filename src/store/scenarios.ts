import { defineStore } from 'pinia'
import { GetData, SetData } from "../utils/store"
import { Scenario } from '../core/scenario/entities'
import { DEFAULT_SCENARIOS } from './default'
import { SystemTrayManager } from '../utils/system_tray_manager'

export const useScenarios = defineStore('scenarios', {
    state: () => ({
        _scenarios: [] as Scenario[],
        _current_scenario: 0,
    }),
    getters: {
        scenario(state) {
            return (id: string) => {
                const scenario = state._scenarios.find(scenario => scenario.id == id)
                if (!scenario) {
                    return null
                }

                return scenario
            }
        },
        scenarios(state) {
            return state._scenarios
        },
        currentScenario(state) {
            return state._scenarios[state._current_scenario]
        }
    },
    actions: {
        addScenario(scenario: Scenario) {
            // insert if not exists
            if (!this._scenarios.find(sc => sc.id == scenario.id)) {
                this._scenarios.push(scenario)
            } else {
                // update
                this._scenarios = this._scenarios.map(sc => {
                    if (sc.id == scenario.id) {
                        return scenario
                    }
                    return sc
                })
            }

            SetData('scenarios', this._scenarios)
            this.updateSystemTray()
        },
        removeScenario(id: string) {
            this._scenarios = this._scenarios.filter(sc => sc.id != id)
            SetData('scenarios', this._scenarios)
            this.updateSystemTray()
        },
        updateScenario(scenario: Scenario) {
            this.addScenario(scenario)
            this.updateSystemTray()
        },
        initScenarios() {
            SystemTrayManager.ClearEventListeners()
            setTimeout(async () => {
                const scenarios = await  GetData<Scenario[]>('scenarios', [])
                if (scenarios) {
                    this._scenarios = scenarios
                }
                for (const c of DEFAULT_SCENARIOS) {
                    this.addScenario(c)
                }

                this.updateSystemTray()

                SystemTrayManager.SetEventListeners(item => {
                    // change current scenario
                    const scenario = this._scenarios.find(sc => sc.id == item.id)
                    if (!scenario) {
                        return
                    }

                    this._current_scenario = this._scenarios.indexOf(scenario)

                    // update system tray
                    this.updateSystemTray()
                })
            })
        },
        updateSystemTray() {
            SystemTrayManager.Clear()
            for (const scenario of this._scenarios) {
                SystemTrayManager.Add({
                    id: scenario.id,
                    label: scenario.name,
                    active: scenario.id == this._scenarios[this._current_scenario].id,
                })
            }
        }
    }
})
