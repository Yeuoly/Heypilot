import { LargeLanguageModel } from "./__base/large_language_model"
import { AIModelEntity } from "./__base/model_entities"
import { ProviderEntity } from "./__base/provider_entities"
import { useCredentials, pinia } from '../../store/index'
import { computed } from "vue"
import { storeToRefs } from 'pinia'

const credentialsStore = useCredentials(pinia)

export namespace ModelManager {
    const model_instances: Map<string, LargeLanguageModel> = new Map()
    const provider_instances: Map<string, LargeLanguageModel> = new Map()
    const provider_entities: Map<string, ProviderEntity> = new Map()

    const model_files = import.meta.glob('./model_providers/**/*.yaml', { eager: true, import: 'default' }) as Record<string, any>
    const provider_modules = import.meta.glob('./model_providers/**/*.ts', { eager: true, import: 'default' }) as Record<string, LargeLanguageModel>
    const llm_entities: Map<string, AIModelEntity[]> = new Map()

    for (const model_name in model_files) {
        // extract provider and model name
        const parts = model_name.split('/')
        const provider = parts[2]
        const model_name_part = parts[3].split('.')[0]

        if (model_name_part !== provider) {
            if (!llm_entities.has(provider)) {
                llm_entities.set(provider, [])
            }
    
            const model_entity = model_files[model_name]
            llm_entities.get(provider)?.push(model_entity)
        } else {
            provider_entities.set(provider, model_files[model_name] as ProviderEntity)
        }
    }

    llm_entities.forEach((models, provider) => {
        const model_module = provider_modules[`./model_providers/${provider}/llm.ts`]
        if (!model_module) {
            throw new Error(`Provider ${provider} is not found`)
        }

        // @ts-ignore
        const model_instance = new model_module(models)
        for (const model of models) {
            model_instances.set(`${provider}/${model.model}`, model_instance)
            provider_instances.set(provider, model_instance)
        }
    })

    export const AddProviderCredentials = (provider: string, credentials: any) => {
        credentialsStore.add_provider_credential({
            provider: provider,
            type: 'provider',
            credentials: credentials,
            created_at: Date.now()
        })
    }

    export const AddModelProviderCredentials = (provider: string, model: string, credentials: any) => {
        credentialsStore.add_model_credential({
            provider: provider,
            type: 'model',
            model: model,
            credentials: credentials,
            created_at: Date.now()
        })
    }

    export const RemoveProviderCredentials = (provider: string) => {
        credentialsStore.remove_provider_credential(provider)
    }

    export const GetModelInstance = (
        provider: string, model: string
    ) => {
        const instance = model_instances.get(`${provider}/${model}`)
        if (!instance) {
            throw new Error(`Model ${model} is not found in provider ${provider}`)
        }

        return instance
    }

    export const GetProviderInstance = (
        provider: string
    ) => {
        const instance = provider_instances.get(provider)
        if (!instance) {
            throw new Error(`Provider ${provider} is not found`)
        }

        return instance
    }

    export const GetModelEntity = (
        provider: string, model: string
    ) => {
        const instance = GetProviderInstance(provider)
        const model_entity = instance.model_schemas.find((model_entity) => model_entity.model === model)
        if (!model_entity) {
            throw new Error(`Model ${model} is not found in provider ${provider}`)
        }

        return model_entity
    }

    export const GetProviderCredentials = (
        provider: string
    ) => {
        const credentials = credentialsStore.provider_credentials(provider)
        if (!credentials) {
            throw new Error(`Provider ${provider} is not found`)
        }

        return credentials.credentials
    }

    export const GetModelCredentials = async (
        provider: string, model: string
    ) => {
        const credentials = credentialsStore.model_credentials(provider, model)

        if (!credentials) {
            throw new Error(`Model ${model} is not found in provider ${provider}`)
        }

        return credentials.credentials
    }

    export const ListModelsCredentials = (provider: string) => {
        const credentials = credentialsStore.list_models_credentials(provider)

        return Object.fromEntries(credentials.map((credential) => [credential.model, credential.credentials]))
    }

    export const CountAliveModels = async (provider: string) => {
        let count = 0
        try {
            await GetProviderCredentials(provider)
            const provider_instance = GetProviderInstance(provider)
            count += provider_instance.model_schemas.length
        } catch (e) {}

        count += Object.keys((await ListModelsCredentials(provider))).length
        
        return count
    }

    export const useAliveModelsCount = () => {
        const { list_models_credentials, provider_credentials } = storeToRefs(useCredentials())

        const counter = computed(() => {
            return (provider: string) => {
                let count = 0
                try {
                    const provider_credentials_value = provider_credentials.value(provider)
                    if (provider_credentials_value) {
                        const provider_instance = GetProviderInstance(provider)
                        count += provider_instance.model_schemas.length
                    }
                } catch (e) {}
    
                count += list_models_credentials.value(provider).length
                
                return count
            }
        })

        return {
            counter
        }
    }

    export const ListProviders = () => {
        return Array.from(provider_entities.values())
    }

    export const ListProviderInstances = () => {
        return provider_instances
    }

    export const GetProvider = (provider: string) => {
        const provider_entity = provider_entities.get(provider)
        if (!provider_entity) {
            throw new Error(`Provider ${provider} is not found`)
        }

        return provider_entity
    }

    export const ValidateModelCredentials = async (provider: string, model: string, credentials: any) => {
        const llm = GetProviderInstance(provider)
        const new_credentials = {
            ...credentials
        }
        try {
            delete new_credentials['model']
        } catch (e) {}
        await llm.validate_credentials(model, credentials)
    }

    export const ValidateProviderCredentials = async (provider: string, credentials: any) => {
        const llm = GetProviderInstance(provider)
        // get cheapest model
        let cheapest: AIModelEntity = llm.model_schemas[0]

        for (const model of llm.model_schemas) {
            if (!model.pricing || !cheapest.pricing) {
                cheapest = model
                continue
            }

            if (model.pricing?.input < cheapest.pricing?.input) {
                cheapest = model
                continue
            }
        }

        await llm.validate_credentials(cheapest.model, credentials)
    }

    export const TotalAliveModels = async () => {
        let count = 0
        for (const provider of provider_entities.keys()) {
            count += await CountAliveModels(provider)
        }

        return count
    }
}