import { defineStore } from 'pinia'
import { GetData, SetData } from "../utils/store"

interface ModelCredential {
    provider: string,
    model?: string,
    type: 'provider' | 'model',
    credentials: any,
    created_at: number,
}

export const useCredentials = defineStore('credentials', {
    state: () => ({
        _model_credentials: [] as ModelCredential[]
    }),
    getters: {
        provider_credentials(state) {
            return (provider: string) => {
                const credentials = state._model_credentials.filter(cred => cred.provider == provider && cred.type == 'provider')
                if (!credentials.length) {
                    return null
                }

                return credentials[0]
            }
        },
        model_credentials(state) {
            return (provider: string, model: string) => {
                const credentials = state._model_credentials.filter(cred => cred.provider == provider && cred.model == model && cred.type == 'model')
                if (!credentials.length) {
                    return null
                }

                return credentials[0]
            }
        },
        list_models_credentials(state) {
            return (provider: string) => {
                return state._model_credentials.filter(cred => cred.provider == provider && cred.type == 'model')
            }
        },
    },
    actions: {
        add_provider_credential(credential: ModelCredential) {
            // insert if not exists
            if (!this._model_credentials.find(cred => cred.provider == credential.provider)) {
                this._model_credentials.push(credential)
            } else {
                // update
                this._model_credentials = this._model_credentials.map(cred => {
                    if (cred.provider == credential.provider) {
                        return credential
                    }
                    return cred
                })
            }

            SetData('provider_credentials', this._model_credentials)
        },
        add_model_credential(credential: ModelCredential) {
            // insert if not exists
            if (!this._model_credentials.find(cred => cred.provider == credential.provider && cred.model == credential.model)) {
                this._model_credentials.push(credential)
            } else {
                // update
                this._model_credentials = this._model_credentials.map(cred => {
                    if (cred.provider == credential.provider && cred.model == credential.model) {
                        return credential
                    }
                    return cred
                })
            }

            SetData('provider_credentials', this._model_credentials)
        },
        remove_provider_credential(provider: string) {
            this._model_credentials = this._model_credentials.filter(cred => cred.provider != provider)

            SetData('provider_credentials', this._model_credentials)
        },
        remove_model_credential(provider: string, model: string) {
            this._model_credentials = this._model_credentials.filter(cred => cred.provider != provider && cred.model != model)

            SetData('provider_credentials', this._model_credentials)
        },
        remove_all_credentials() {
            this._model_credentials = []

            SetData('provider_credentials', this._model_credentials)
        },
        initCredentials() {
            setTimeout(async () => {
                const credentials = await GetData<ModelCredential[]>('provider_credentials', [])
                if (!Array.isArray(credentials)) {
                    return
                }

                this._model_credentials = credentials
            })
        }
    }
})
