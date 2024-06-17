import { useScenarios, pinia } from "../../store"
import { PromptMessage } from "../model_runtime/__base/entities"
import { Scenario } from "./entities"
import { storeToRefs } from 'pinia'

const scenarioStore = useScenarios(pinia)

export namespace ScenarioManager {
    export const useScenario = () => {
        const store = useScenarios()
        const { scenario, updateScenario } = useScenarios()

        const getter = (id: string) => {
            return scenario(id)
        }

        const update = (scenario: Scenario) => {
            updateScenario(scenario)
        }

        const { currentScenario } = storeToRefs(store)
        
        return {
            getter,
            update,
            currentScenario
        }
    }

    export const getCurrentScenario = () => {
        return scenarioStore.currentScenario
    }

    export const formatScenario = (scenario: Scenario, query: string, context: string) => {
        const system_message = scenario.system_message.replace('{{query}}', query).replace('{{context}}', context)
        const user_message = scenario.user_message_template.replace('{{query}}', query).replace('{{context}}', context)
        
        return {
            system_message, user_message
        }
    }
}