export enum ScenarioMode {
    CHAT = 'chat',
    COMPLETION = 'completion'
}

export interface ModelConfig {
    model: string
    provider: string
    params: any
}

export interface AdvancedSetting {
    auto_commit: boolean
}

export interface Scenario {
    id: string
    name: string
    system_message: string
    user_message_template: string
    mode: ScenarioMode,
    created_at: number,
    model_config: ModelConfig,
    advanced_setting: AdvancedSetting
}