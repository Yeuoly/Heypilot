export enum PromptMessageRole {
    SYSTEM = 'system',
    USER = 'user',
    ASSISTANT = 'assistant',
    TOOL = 'tool'
}

export interface PromptMessage {
    role: PromptMessageRole
    content: string | PromptMessageContent[]
    name?: string
}

export enum PromptMessageContentType {
    TEXT = 'text',
    IMAGE = 'image',
}

export interface PromptMessageContent { 
    type: PromptMessageContentType
    data: string
}

export enum PromptMessageImageContentDetail {
    LOW = 'low',
    HIGH = 'high',
}

export interface PromptMessageTextContent extends PromptMessageContent {
    type: PromptMessageContentType.TEXT
}

export interface PromptMessageImageContent extends PromptMessageContent {
    type: PromptMessageContentType.IMAGE
    data: string
    detail: PromptMessageImageContentDetail
}

export interface UserPromptMessage extends PromptMessage {
    role: PromptMessageRole.USER
}

export interface FunctionCall {
    name: string,
    arguments: string
}

export enum ToolCallType {
    FUNCTION = 'function',
}

export interface ToolCall {
    id: string
    type: ToolCallType
    function: FunctionCall
}

export interface AssistantPromptMessage extends PromptMessage {
    role: PromptMessageRole.ASSISTANT
    tool_calls?: ToolCall[]
}

export interface SystemPromptMessage extends PromptMessage {
    role: PromptMessageRole.SYSTEM
}

export interface ToolPromptMessage extends PromptMessage {
    role: PromptMessageRole.TOOL
    tool_call_id?: string
}

export interface PromptMessageTool {
    name: string
    description: string
    parameters: {[key: string]: string}
}