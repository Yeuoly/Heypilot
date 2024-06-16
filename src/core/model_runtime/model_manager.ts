import { GetData, SetData } from "../../utils/store"
import { LargeLanguageModel } from "./__base/large_language_model"
import { AIModelEntity } from "./__base/model_entities"
import { ProviderEntity } from "./__base/provider_entities"

export namespace ModelManager {
    const model_instances: Map<string, LargeLanguageModel> = new Map()
    const provider_instances: Map<string, LargeLanguageModel> = new Map()
    const model_credentials: Map<string, any> = new Map()
    const provider_credentials: Map<string, any> = new Map()
    const provider_entities: Map<string, ProviderEntity> = new Map()

    const model_files = import.meta.glob('./model_providers/**/*.yaml', { eager: true, import: 'default' }) as Record<string, any>
    const provider_modules = import.meta.glob('./model_providers/**/*.ts', { eager: true, import: 'default' }) as Record<string, LargeLanguageModel>
    const llm_entities: Map<string, AIModelEntity[]> = new Map()

    for (const model_name in model_files) {
        // extract provider and model name
        const parts = model_name.split('/')
        const provider = parts[2]
        const model_name_part = parts[3].split('.')[0]

        console.log(model_name_part, provider)

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

    const InitModelCredentials = async () => {
        const data = await GetData<{
            [key: string]: any
        }>('models_credentials', {})
        for (const provider in data) {
            model_credentials.set(provider, data[provider])
        }

        const provider_data = await GetData<{
            [key: string]: any
        }>('provider_credentials', {})
        for (const provider in provider_data) {
            provider_credentials.set(provider, provider_data[provider])
        }
    }

    export const AddProviderCredentials = async (provider: string, credentials: any) => {
        provider_credentials.set(provider, credentials)
        const data: any = {}
        provider_credentials.forEach((value, key) => {
            data[key] = value
        })

        await SetData('provider_credentials', data)
    }

    export const AddModelProviderCredentials = async (provider: string, model: string, credentials: any) => {
        model_credentials.set(`${provider}/${model}`, credentials)
        const data: any = {}
        model_credentials.forEach((value, key) => {
            data[key] = value
        })

        await SetData('models_credentials', data)
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

    export const GetProviderCredentials = async (
        provider: string
    ) => {
        await InitModelCredentials()

        const credentials = provider_credentials.get(provider)
        if (!credentials) {
            throw new Error(`Provider ${provider} is not found`)
        }

        return credentials
    }

    export const GetModelCredentials = async (
        provider: string, model: string
    ) => {
        await InitModelCredentials()

        const credentials = model_credentials.get(`${provider}/${model}`)
        if (!credentials) {
            throw new Error(`Model ${model} is not found in provider ${provider}`)
        }

        return credentials
    }

    export const ListModelsCredentials = async (provider: string) => {
        await InitModelCredentials()

        return Object.fromEntries([...model_credentials].filter(([key]) => key.startsWith(provider)))
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

    export const ListProviders = () => {
        return Array.from(provider_entities.values())
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
}