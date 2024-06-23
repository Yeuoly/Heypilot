<template>
    <div class="flex flex-col h-full p-2">
        <div class="text-lg pl-2 flex items-center h-10">
            <div class="flex-grow">
                <input class="w-full bg-transparent text-white border-b border-gray-500 focus:border-blue-500 w-full placeholder-gray-400 focus:outline-none"
                    v-model="name"
                    placeholder="Scenario Name"
                />
            </div>
            <div class="flex flex-row-reverse h-8 text-sm items-center">
                <div  @click="updateScenario" class="border border-blue-500 p-1 px-3 rounded-md mr-2 cursor-pointer text-primary">
                    Save
                </div>
                <Popup class="border border-gray-500 p-1 px-2 rounded-md items-center h-8 mr-2"
                    :width="300"
                    :height="400"
                >
                    <template v-slot:placeholder>
                        <div class="flex cursor-pointer">
                            <div class="w-5 mr-2">
                                <Advanced class="w-5" />
                            </div>
                            <div>
                                Advanced Settings
                            </div>
                        </div>
                    </template>
                    <template v-slot:popup>
                        <div class="mt-2 p-2 bg-background rounded-lg h-full shadow-lg" @click.stop="() => {}">
                            <p class="text-xs font-semibold text-gray-400 w-full pb-1">Assistant Mode</p>
                            <div class="w-full">
                                <RadioInput v-model="mode" :options="[{
                                    label: 'Chat',
                                    value: ScenarioMode.CHAT
                                }, {
                                    label: 'Complete',
                                    value: ScenarioMode.COMPLETION
                                }]
                                "></RadioInput>
                            <p class="text-xs font-semibold text-gray-400 w-full py-1">Auto Sending using Hotkey</p>
                            <SwitchInput v-model="advanced_setting.auto_commit" />
                        </div>
                        </div>
                    </template>
                </Popup>
                <ModelSelect class="w-40 h-8 mx-2" v-model="model_select"></ModelSelect>
            </div>
        </div>
        <div class="flex-grow flex flex-col">
            <div class="p-2 h-1/2 flex flex-col h-full">
                <Textarea class="flex-grow" v-model="system_message" label="System Message"></Textarea>
            </div>
            <div class="p-2 h-1/2 flex flex-col h-full">
                <Textarea class="flex-grow" v-model="user_message_template" label="User Message Template"></Textarea>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ScenarioManager } from '../../../../../../core/scenario/scenario_manager'
import { AdvancedSetting, ModelConfig, ScenarioMode } from '../../../../../../core/scenario/entities'
import Textarea from '../../../../../../components/schema_input/Textarea.vue'
import RadioInput from '../../../../../../components/schema_input/RadioInput.vue'
import ModelSelect from '../../../../../../components/model/ModelSelect.vue'
import SwitchInput from '../../../../../../components/schema_input/SwitchInput.vue'
import Popup from '../../../../../../components/common/Popup.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Advanced from './icons/advanced.svg'

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
const advanced_setting = ref<AdvancedSetting>({
    auto_commit: false
})

const id = ref<string | null>(null)

const refreshScenario = async () => {
    if (!id.value) {
        return
    }

    const scenario = getter(id.value)

    if (scenario) {
        system_message.value = scenario.system_message
        user_message_template.value = scenario.user_message_template
        name.value = scenario.name
        model_select.value = scenario.model_config
        mode.value = scenario.mode
        advanced_setting.value = scenario.advanced_setting
    }
}

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
        advanced_setting: advanced_setting.value,
        created_at: Date.now(),
    })
}

watch(() => route.params.id, (nid) => {
    id.value = nid as string
    refreshScenario()
}, { immediate: true })

</script>