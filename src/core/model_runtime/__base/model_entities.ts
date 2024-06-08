import { I18nObject } from "./common_entities"

export enum ParameterType {
    FLOAT = "float",
    INT = "int",
    STRING = "string",
    BOOLEAN = "boolean"
}

export interface ParameterRule {
    name: string
    use_template?:string
    label: I18nObject
    type: ParameterType
    help?:I18nObject
    required: boolean 
    default?:any
    min?:number
    max?:number
    precision?: number
    options?: string[]
}

export interface PriceConfig {
    input: number
    output?: number
    unit: number
    currency: string
}

export enum ModelPropertyKey {
    MODE = "mode",
    CONTEXT_SIZE = "context_size",
    MAX_CHUNKS = "max_chunks",
    FILE_UPLOAD_LIMIT = "file_upload_limit",
    SUPPORTED_FILE_EXTENSIONS = "supported_file_extensions",
    MAX_CHARACTERS_PER_CHUNK = "max_characters_per_chunk",
    DEFAULT_VOICE = "default_voice",
    VOICES = "voices",
    WORD_LIMIT = "word_limit",
    AUDIO_TYPE = "audio_type",
    MAX_WORKERS = "max_workers"
}

export enum ModelFeature {
    TOOL_CALL = "tool-call",
    MULTI_TOOL_CALL = "multi-tool-call",
    AGENT_THOUGHT = "agent-thought",
    VISION = "vision",
    STREAM_TOOL_CALL = "stream-tool-call"
}

export enum DefaultParameterName {
    TEMPERATURE = "temperature",
    TOP_P = "top_p",
    PRESENCE_PENALTY = "presence_penalty",
    FREQUENCY_PENALTY = "frequency_penalty",
    MAX_TOKENS = "max_tokens",
}

export interface ProviderModel {
    model: string
    label: I18nObject
    features?: ModelFeature[]
    model_properties: {
        [key in ModelPropertyKey]: any
    }
    deprecated: boolean
}

export interface AIModelEntity extends ProviderModel {
    parameter_rules: ParameterRule[]
    pricing?: PriceConfig
}