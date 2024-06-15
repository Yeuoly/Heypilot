<template>
    <div class="p-3 overflow-y-auto">
        <div v-for="provider in providers" class="p-2 bg-gray-900 rounded-lg cursor-pointer">
            <div class="flex">
                <div class="flex-grow">
                    <div class="font-semibold text-xl">
                        {{ provider.label.en_US }}
                    </div>
                    <div class="text-sm">
                        {{ provider.description?.en_US }}
                    </div>
                </div>
                <div class="w-20">
                    <div>
                        
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

const providers = ref<ProviderEntity[]>([])

onMounted(() => {
    providers.value = ModelManager.ListProviders()
})
</script>