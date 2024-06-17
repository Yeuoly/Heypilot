<template>
    <div class="overflow-y-auto flex h-full w-full">
        <div class="w-1/4 bg-gray-900 h-full flex flex-col overflow-y-auto">
            <div class="p-3 text-lg flex">
                <Scenario class="w-6 mr-2" />
                Scenario Settings
            </div>
            <div class="flex-grow px-3">
                <p class="text-xs font-semibold text-gray-400 w-full pb-1">Scenarios</p>
                <div v-for="scenario in scenarios" 
                    @click="to(scenario.id)"
                    class="rounded-lg p-2 my-1 hover:bg-gray-700 cursor-pointer flex items-center"
                    :class="{
                        'bg-gray-700': activeScenario == scenario.id
                    }">
                    <div v-if="scenario.mode == ScenarioMode.CHAT" class="w-5 mr-2">
                        <Bot class="w-6" />
                    </div>
                    <div v-else class="w-5 mr-2">
                        <Pen class="w-5" />
                    </div>
                    <div class="truncate">
                        {{ scenario.name }}
                    </div>
                </div>
                <p class="text-xs font-semibold text-gray-400 w-full py-1">Custom</p>
                <div class="rounded-lg p-2 bg-gray-700 cursor-pointer text-center  truncate">Coming soon</div>
            </div>
        </div>
        <div class="flex-grow">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import Scenario from './icons/scenario.svg'
import Bot from './icons/bot.svg'
import Pen from './icons/pen.svg'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useScenarios } from '../../../../store'
import { storeToRefs } from 'pinia'
import { ScenarioMode } from '../../../../core/scenario/entities'
import { onMounted, ref, watch } from 'vue'

const { scenarios } = storeToRefs(useScenarios())

const router = useRouter()
const route = useRoute()
const activeScenario = ref('')

onMounted(() => {
    if (scenarios.value) {
        router.push(`/settings/setup_scenario/${scenarios.value[0].id}`)
    }
})

watch(() => route.params.id, (id) => {
    activeScenario.value = id as string
}, { immediate: true })

const to = (id: string) => {
    router.push(`/settings/setup_scenario/${id}`)
}

</script>