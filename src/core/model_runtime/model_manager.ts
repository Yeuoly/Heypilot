import { GetData, SetData } from "../../utils/store"
import { LargeLanguageModel } from "./__base/large_language_model"
import { AIModelEntity } from "./__base/model_entities"
import { ProviderEntity } from "./__base/provider_entities"

export namespace ModelManager {
    const model_instances: Map<string, LargeLanguageModel> = new Map()
    const model_credentials: Map<string, any> = new Map()
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
        }
    })

    const InitModelCredentials = async () => {
        const data = await GetData<any>('provider_credentials')
        for (const provider of data) {
            model_credentials.set(provider.provider, provider)
        }
    }

    export const AddModelCredentials = async (provider: string, credentials: any) => {
        model_credentials.set(provider, credentials)
        const data: any = {}
        model_credentials.forEach((value, key) => {
            data[key] = value
        })

        SetData('provider_credentials', data)
    }

    export const GetModelInstance = async (
        provider: string, model: string
    ) => {
        const instance = model_instances.get(`${provider}/${model}`)
        if (!instance) {
            throw new Error(`Model ${model} is not found in provider ${provider}`)
        }

        return instance
    }

    export const GetProviderCredentials = async (
        provider: string
    ) => {
        if (model_credentials.size == 0) {
            await InitModelCredentials()
        }

        const credentials = model_credentials.get(provider)
        if (!credentials) {
            throw new Error(`Provider ${provider} is not found`)
        }

        return credentials
    }

    export const ListProviders = () => {
        return Array.from(provider_entities.values())
    }
}