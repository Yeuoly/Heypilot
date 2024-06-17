import { createPinia } from 'pinia'
import { useCredentials } from './credentials'
import { useScenarios } from './scenarios'

export const pinia = createPinia()

const credentials = useCredentials(pinia)
const scenarios = useScenarios(pinia)

credentials.initCredentials()
scenarios.initScenarios()


export {
    useCredentials,
    useScenarios
}