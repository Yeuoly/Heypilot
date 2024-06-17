<template>
<div @click="open" ref="hover" class="w-full border p-2 rounded-md relative" :class="{
    'border-red-600': !aliveModels
}">
    <div v-if="aliveModels">
        {{ model }}
    </div>
    <div v-else class="flex items-center">
        <div class="w-5">
            <Warning />
        </div>
        <div class="w-5 text-center flex-grow">
            Setup Model
        </div>
    </div>
    <div v-if="show" class="absolute rounded-md bg-gray-900 border w-full top-11 left-0">
        <div class="p-1 px-2 pb-2" v-for="provider in providers">
            <p class="text-xs font-semibold text-gray-400 w-full pb-1">{{ provider[0] }}</p>
            <div class="hover:bg-gray-700 rounded p-1" v-for="provider_entity in provider[1].model_schemas"
                @click.stop="select(provider[0], provider_entity.model)">
                {{ provider_entity.label.en_US }}
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ModelManager } from '../../core/model_runtime/model_manager'
import Warning from './icons/warning.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

const model = defineModel<string>('model', {
    required: true
})
const provider = defineModel<string>('provider', {
    required: true
})

const show = ref(false)
const position = ref({
    x: 0, y: 0
})
const providers = ref(ModelManager.ListProviderInstances())

const hover = ref<HTMLDivElement | null>(null)
const aliveModels = ref(0)
onMounted(async () => {
    aliveModels.value = await ModelManager.TotalAliveModels()
})

const open = async () => {
    if (!await ModelManager.TotalAliveModels()) {
        router.push('/settings/setup_model')
        return
    }

    // get current position
    const rect = hover.value?.getBoundingClientRect()
    if (!rect) {
        return
    }

    if (show.value) {
        show.value = false
        return
    }

    position.value = {
        x: rect.left,
        y: rect.top -10
    }

    show.value = true
}

const select = (_provider: string, _model: string) => {
    model.value = _model
    provider.value = _provider
    show.value = false
}

</script>