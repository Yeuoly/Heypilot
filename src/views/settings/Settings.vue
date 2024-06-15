<template>
    <div class="flex w-full h-screen bg-black text-white">
        <div class="w-1/5 bg-gray-950 p-2 pt-2">
            <div class="w-full">
                <div @click="back" class="h-10 flex items-center justify-left w-full hover:bg-gray-800 cursor-pointer
        transition duration-200 rounded-md">
                    <div class="w-12 px-2">
                        <Back class="w-6" />
                    </div>
                    <div class="text-sm font-semibold text-sm">
                        Back
                    </div>
                </div>
                <div class="p-1 w-full">
                    <p class="text-xs font-semibold text-gray-400 w-full">Model</p>
                    <button @click="to('/settings/use_model')" 
                        class="text-sm text-left w-full p-2 text-white hover:bg-gray-800 rounded-md truncate">
                        <div class="flex">
                            <div class="pr-2">
                                <Model class="w-5"/>
                            </div>
                            <div>
                                Choose Model
                            </div>
                        </div>
                    </button>
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
                    <p class="text-xs font-semibold text-gray-400 w-full">Advanced</p>
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
        <div class="w-4/5 bg-gray-800 flex flex-col space-y-4 w-full">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, RouterView } from 'vue-router'
import Back from './icons/back.svg'
import Model from './icons/model.svg'
import Setup from './icons/setup.svg'
import Hotkey from './icons/hotkey.svg'

const router = useRouter()

const back = () => {
    router.back()
}

const to = (path: string) => {
    router.push(path)
}

</script>