<template>
    <div class="p-3 overflow-y-auto">
        <div v-for="provider in providers" class="p-4 bg-gray-900 rounded-xl my-1">
            <div class="flex">
                <div class="flex-grow">
                    <div class="font-semibold text-xl">
                        {{ provider.provider.label.en_US }}
                    </div>
                    <div class="text-sm pt-2">
                        {{ provider.provider.description?.en_US }}
                    </div>
                </div>
                <div class="w-40 h-8 border border-1 border-blue-700 rounded-lg">
                    <div class="p-1 bg-grey-700 flex items-center cursor-pointer"
                        @click="setupModel(provider.provider.provider)">
                        <div v-if="counter(provider.provider.provider)" class="bg-green-400 ml-2 w-2 h-2 rounded-full"></div>
                        <div v-else class="bg-red-400 ml-2 w-2 h-2 rounded-full"></div>
                        <div v-if="counter(provider.provider.provider)" class="pl-2 text-center text-sm text-white-100">
                            {{ counter(provider.provider.provider) }} models alive
                        </div>
                        <div v-else class="pl-2 flex-grow text-center text-sm text-white-100">
                            Setup
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ModelManager } from '../../../../core/model_runtime/model_manager'
import { ProviderEntity } from '../../../../core/model_runtime/__base/provider_entities'
import { SetupModel } from '../../../setup_model'

const providers = ref<{
    provider: ProviderEntity,
}[]>([])

const { counter } = ModelManager.useAliveModelsCount()

onMounted(() => refresh())

const refresh = async () => {
    providers.value = await Promise.all(ModelManager.ListProviders().map(async provider => {
        return {
            provider: provider,
        }
    }))
}

const setupModel = (provider: string) => {
    SetupModel(provider)
}
</script>