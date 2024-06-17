<template>
    <div class="flex flex-col h-full p-2">
        <div class="text-lg pl-2 bg-gray-800 flex items-center h-10">
            <div v-if="scenario?.mode == ScenarioMode.CHAT" class="w-8 mr-2">
                <Bot class="w-8" />
            </div>
            <div v-else class="w-5 mr-2">
                <Pen class="w-5" />
            </div>
            <div class="flex-grow">
                <input class="bg-transparent text-white border-b w-full placeholder-gray-400 focus:outline-none"
                    v-model="name"
                    placeholder="Scenario Name"
                />
            </div>
            <div class="flex-grow flex flex-row-reverse h-8 text-sm">
                <RadioInput v-model="mode" :options="[{
                    label: 'Chat',
                    value: ScenarioMode.CHAT
                }, {
                    label: 'Complete',
                    value: ScenarioMode.COMPLETION
                }]
                " :child_class="['w-20']"></RadioInput>
                <ModelSelect class="w-40 h-8 mx-2" v-model="model_select"></ModelSelect>
            </div>
        </div>
        <div class="flex-grow flex flex-col">
            <div class="p-2 h-1/2 flex flex-col h-full">
                <div class="text-sm mb-1">
                    System Message
                </div>
                <Textarea class="flex-grow" v-model="system_message"></Textarea>
            </div>
            <div class="p-2 h-1/2 flex flex-col h-full">
                <div class="text-sm mb-1">
                    User Message Template
                </div>
                <Textarea class="flex-grow" v-model="user_message_template"></Textarea>
            </div>
        </div>
        <div class="h-16 p-2">
            <button @click="updateScenario" class="w-20 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
                Save
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ScenarioManager } from '../../../../../../core/scenario/scenario_manager'
import { ModelConfig, ScenarioMode } from '../../../../../../core/scenario/entities'
import Textarea from '../../../../../../components/schema_input/Textarea.vue'
import RadioInput from '../../../../../../components/schema_input/RadioInput.vue'
import ModelSelect from '../../../../../../components/model/ModelSelect.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Bot from '../../icons/bot.svg'
import Pen from '../../icons/pen.svg'

const route = useRoute()
const {
    getter, update
} = ScenarioManager.useScenario()

const system_message = ref('')
const user_message_template = ref('')
const mode = ref(ScenarioMode.CHAT)
const name = ref('')
const model_select = ref<ModelConfig>({
    provider: 'openai',
    model: 'gpt-4o',
    params: {}
})

const id = ref<string | null>(null)
const scenario = computed(() => {
    if (!id.value) {
        return null
    }

    const scenario = getter(id.value)

    if (scenario) {
        system_message.value = scenario.system_message
        user_message_template.value = scenario.user_message_template
        name.value = scenario.name
        model_select.value = scenario.model_config
        mode.value = scenario.mode
    }

    return scenario
})

const updateScenario = () => {
    if (!id.value) {
        return
    }

    update({
        id: id.value,
        name: name.value,
        system_message: system_message.value,
        user_message_template: user_message_template.value,
        mode: mode.value,
        model_config: model_select.value,
        created_at: Date.now()
    })
}

watch(() => route.params.id, (nid) => {
    id.value = nid as string
}, { immediate: true })

</script>