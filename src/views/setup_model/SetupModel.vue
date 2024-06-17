<template>
    <slot></slot>
    <div v-if="show" class="absolute bg-gray-900 top-0 left-0 w-full h-full opacity-80"></div>
    <div v-if="show" class="absolute top-0 left-0 w-full h-full">
        <div class="flex justify-center items-center h-full shadow-lg">
            <div class="bg-gray-800 opacity-100 p-4 rounded-xl w-2/3">
                <div class="flex flex-row-reverse">
                    <div @click="onClose">
                        <Close class="w-5 cursor-pointer"/>
                    </div>
                    <div class="text-2xl flex-grow font-semibold text-left text-white">
                        Setup {{ provider_entity?.label.en_US }}
                    </div>
                </div>
                <div class="text-left text-gray-400">
                    <div v-if="provider_entity?.model_credential_schema && provider_entity?.provider_credential_schema"
                        class="py-2"
                    >
                        <div class="text-sm text-white pb-1">
                            Method
                        </div>
                        <RadioInput :options="[{
                            label: 'Setup Provider',
                            value: 'provider'
                        }, {
                            label: 'Setup Model',
                            value: 'model'
                        }]" v-model="setup_method"></RadioInput>
                    </div>
                </div>
                <div v-if="setup_method == 'provider'">
                    <template v-for="schema in provider_entity?.provider_credential_schema?.credential_form_schemas">
                        <div class="text-sm text-white pt-1 text-white">
                            {{ schema.label.en_US }}
                        </div>
                        <div class="flex pb-2">
                            <SchemaInput :schema="schema" v-model="model_credential[schema.variable]" />
                        </div>
                    </template>
                </div>
                <div v-else-if="setup_method == 'model'">
                    <template v-for="schema in [
                        modelSchema,
                        ...provider_entity?.model_credential_schema?.credential_form_schemas || []
                    ]">
                        <div class="text-sm text-white pt-1 text-white">
                            {{ schema.label.en_US }}
                        </div>
                        <div class="flex pb-2">
                            <SchemaInput :schema="schema" v-model="model_credential[schema.variable]" />
                        </div>
                    </template>
                </div>
                <div class="py-2 flex">
                    <div class="flex">
                        <button @click="setupCredentials" class="text-white bg-gray-900 hover:bg-gray-700 p-2 px-5 rounded-md flex">
                            <Loading v-if="loading" class="w-6 animate-spin mr-2" />
                            Setup
                        </button>
                    </div>
                    <div class="ml-2" v-if="setup_method == 'provider'">
                        <button @click="removeCredentials" class="text-white bg-red-800 hover:bg-red-700 p-2 px-5 rounded-md">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Close from './icons/close.svg'
import { SetupModelEvent } from '.'
import { ModelManager } from '../../core/model_runtime/model_manager'
import { CredentialFormSchema, FormType, ProviderEntity } from '../../core/model_runtime/__base/provider_entities'
import SchemaInput from '../../components/schema_input/SchemaInput.vue'
import RadioInput from '../../components/schema_input/RadioInput.vue'
import { useSnakeMessage } from '../message_box/snake'
import Loading from './icons/loading.svg'

const { openSnakeMessage } = useSnakeMessage()
const show = ref(false)
const loading = ref(false)
const provider = ref('')
const provider_entity = ref<ProviderEntity | null>(null)
const setup_method = ref<string>('provider')
const model_credential = ref<any>({})

const modelSchema: CredentialFormSchema = {
    variable: 'model',
    label: {
        en_US: 'Model Name'
    },
    type: FormType.TEXT_INPUT,
    required: true,
    max_length: 100,
    placeholder: {
        en_US: 'Model Name'
    },
    show_on: [],
}

const refreshProvider = async () => {
    if (provider.value === '') {
        return
    }

    try {
        provider_entity.value = ModelManager.GetProvider(provider.value)
        // setup model credential
        try {
            if (setup_method.value == 'provider') {
                model_credential.value = await ModelManager.GetProviderCredentials(
                    provider_entity.value.provider
                )
            } else {
                model_credential.value = await ModelManager.GetModelCredentials(
                    provider_entity.value.provider,
                    model_credential.value['model']
                )
            }
        } catch (e) {
            model_credential.value = {}
        }

        for (const schema of provider_entity.value?.model_credential_schema?.credential_form_schemas || []) {
            if (!model_credential.value[schema.variable]) {
                model_credential.value[schema.variable] = ''
            }
        }

        for (const schema of provider_entity.value?.provider_credential_schema?.credential_form_schemas || []) {
            if (!model_credential.value[schema.variable]) {
                model_credential.value[schema.variable] = ''
            }
        }

        if (provider_entity.value?.model_credential_schema?.credential_form_schemas) {
            model_credential.value['model'] = ''
        }
    } catch (e) {
    }
}

const validateCredentials = async () => {
    if (setup_method.value == 'provider') {
        await ModelManager.ValidateProviderCredentials(
            provider.value,
            model_credential.value
        )
    } else {
        await ModelManager.ValidateModelCredentials(
            provider.value,
            model_credential.value['model'],
            model_credential.value
        )
    }
}

const setupCredentials = async () => {
    try {
        loading.value = true
        await validateCredentials()
    } catch (e: any) {
        openSnakeMessage({
            message: e,
            type: 'error'
        })
        return
    } finally {
        loading.value = false
    }

    if (setup_method.value == 'provider') {
        ModelManager.AddProviderCredentials(
            provider.value,
            model_credential.value
        )
    } else {
        ModelManager.AddModelProviderCredentials(
            provider.value,
            model_credential.value['model'],
            model_credential.value
        )
    }

    onClose()
}

const removeCredentials = async () => {
    if (setup_method.value == 'provider') {
        ModelManager.RemoveProviderCredentials(provider.value)
    } 
    onClose()
}

onMounted(() => {
    refreshProvider()
    SetupModelEvent.on('setup', (provider_: string) => {
        show.value = true
        provider.value = provider_
        refreshProvider()
    })
})

const onClose = () => {
    show.value = false
    provider_entity.value = null
}

watch(() => setup_method.value, () => {
    refreshProvider()
})

</script>