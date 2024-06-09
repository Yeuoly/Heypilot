<template>
    <div @click="onClick" class="p-2 bg-blue-200">
        Click
    </div>
</template>

<script setup lang="ts">
import { ModelManager } from '../../core/model_runtime/model_manager'
import { LLMResultChunk } from '../../core/model_runtime/__base/llm_entities'
import { PromptMessageRole } from '../../core/model_runtime/__base/entities'

const onClick = async () => {
    const llm = await ModelManager.GetModelInstance('openai', 'gpt-4o')
    llm.invoke('gpt-4o', {
        api_key: import.meta.env.VITE_OPENAI_KEY,
    }, [{
        role: PromptMessageRole.SYSTEM,
        content: 'who are you'
    }], {}, [], [], [{
        onMessage(message: LLMResultChunk) {
            console.log(message)
        },
        onEnd() {
            console.log('end')
        }
    }])
}
</script>