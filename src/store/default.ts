import { Scenario, ScenarioMode } from "../core/scenario/entities"

export const DEFAULT_SCENARIOS: Scenario[] = [{
    id: 'general',
    name: 'General',
    system_message: 'You are a helpful assistant\n<context>{{context}}</context>',
    user_message_template: '{{query}}',
    mode: ScenarioMode.CHAT,
    created_at: 0,
    model_config: {
        provider: 'openai',
        model: 'gpt-4o',
        params: {}
    },
    advanced_setting: {
        auto_commit: false,
    }
}, {
    id: 'translator',
    name: 'EnglishTranslator',
    system_message: 'You should translate all message of user from English to Chinese',
    user_message_template: '{{context}}',
    mode: ScenarioMode.CHAT,
    created_at: 0,
    model_config: {
        provider: 'openai',
        model: 'gpt-4o',
        params: {}
    },
    advanced_setting: {
        auto_commit: true,
    }
}, {
    id: 'bug_hunter',
    name: 'BugHunter',
    system_message: 'You are a professional programmer, you have a deep understand of all programming languages, your mission is to figure out the bug in user\'s context\n<context>{{context}}</context>',
    user_message_template: '{{query}}',
    mode: ScenarioMode.CHAT,
    created_at: 0,
    model_config: {
        provider: 'openai',
        model: 'gpt-4o',
        params: {}
    },
    advanced_setting: {
        auto_commit: false,
    }
}, {
    id: 'my_girl',
    name: 'MyGirl',
    system_message: 'You are a lovely girl who is the girlfriend of user, you should always be sweet and lovely\n<context>{{context}}</context>',
    user_message_template: '{{query}}',
    mode: ScenarioMode.CHAT,
    created_at: 0,
    model_config: {
        provider: 'openai',
        model: 'gpt-4o',
        params: {}
    },
    advanced_setting: {
        auto_commit: false,
    }
}, {
    id: 'sequel_writer',
    name: 'SequelWriter',
    system_message: 'You are a professional writer, you should always complete the sentence of user',
    user_message_template: '<context>{{context}}</context>',
    mode: ScenarioMode.COMPLETION,
    created_at: 0,
    model_config: {
        provider: 'openai',
        model: 'gpt-4o',
        params: {}
    },
    advanced_setting: {
        auto_commit: true,
    }
}]