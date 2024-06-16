<template>
    <div class="w-full">
        <template v-if="schema.type == FormType.RADIO">
            <RadioInput v-model="model" :options="schema.options?.map(v => ({
                label: v.label.en_US,
                value: v.value
            }))" />
        </template>
        <template v-else-if="schema.type == FormType.SELECT">
        </template>
        <template v-else-if="schema.type == FormType.TEXT_INPUT">
            <CommonInput v-model="model" :placeholder="schema.placeholder?.en_US" />
        </template>
        <template v-else-if="schema.type == FormType.SECRET_INPUT">
            <CommonInput type="password" v-model="model" :placeholder="schema.placeholder?.en_US" />
        </template>
    </div>
</template>

<script setup lang="ts">

import { PropType } from 'vue'
import { CredentialFormSchema, FormType } from '../../core/model_runtime/__base/provider_entities'
import RadioInput from './RadioInput.vue'
import CommonInput from './CommonInput.vue'

const prop = defineProps({
    schema: {
        type: Object as PropType<CredentialFormSchema>,
        required: true
    }
})

const model = defineModel<string>({
    required: true
})

</script>