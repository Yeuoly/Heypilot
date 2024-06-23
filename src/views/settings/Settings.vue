<template>
    <div class="flex w-full h-screen bg-background text-white pr-3 py-3 pl-2">
        <div class="w-1/5">
            <div class="h-full">
                <div class="pr-1">
                    <div @click="back" class="h-10 flex items-center justify-left w-full hover:bg-gray-800 cursor-pointer
            transition duration-200 rounded-md">
                        <div class="w-12 px-2">
                            <Back class="w-6" />
                        </div>
                        <div class="text-sm font-semibold text-sm">
                            Back
                        </div>
                    </div>
                </div>
                <div class="w-full pr-1">
                    <p class="text-xs font-semibold text-gray-400 w-full py-1">Model</p>
                    <button @click="to('/settings/setup_model')"
                        class="text-sm text-left w-full p-2 text-white hover:bg-gray-800 rounded-md truncate">
                        <div class="flex">
                            <div class="pr-2">
                                <Setup class="w-5"/>
                            </div>
                            <div>
                                Setup Model
                            </div>
                        </div>
                    </button>
                    <p class="text-xs font-semibold text-gray-400 w-full py-1">Scenario</p>
                    <button @click="to('/settings/setup_scenario')"
                        class="text-sm text-left w-full p-2 text-white hover:bg-gray-800 rounded-md truncate">
                        <div class="flex">
                            <div class="pr-2">
                                <Bot class="w-5"/>
                            </div>
                            <div>
                                Setup Scenario
                            </div>
                        </div>
                    </button>
                    <p class="text-xs font-semibold text-gray-400 w-full py-1">Advanced</p>
                    <button class="text-sm text-left w-full p-2 text-white hover:bg-gray-800 rounded-md truncate">
                        <div class="flex">
                            <div class="pr-2">
                                <Hotkey class="w-5"/>
                            </div>
                            <div>
                                Hotkey
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div class="w-4/5 bg-backgroundSecondary flex flex-col w-full rounded-md">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, RouterView } from 'vue-router'
import Back from './icons/back.svg'
import Setup from './icons/setup.svg'
import Hotkey from './icons/hotkey.svg'
import Bot from './icons/bot.svg'

const router = useRouter()

const back = () => {
    router.back()
}

const to = (path: string) => {
    router.push(path)
}

</script>