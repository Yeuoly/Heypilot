import { I18nObject } from "./common_entities"
import { AIModelEntity, ProviderModel } from "./model_entities"

export enum FormType {
    TEXT_INPUT = "text-input",
    SECRET_INPUT = "secret-input",
    SELECT = "select",
    RADIO = "radio",
    SWITCH = "switch"
}

export interface FormShowOnObject {
    variable: string,
    value: string
}

export class FormOption {
    label: I18nObject
    value: string
    show_on: FormShowOnObject[]

    constructor(value: string, show_on: FormShowOnObject[], label?: I18nObject, ) {
        this.value = value
        this.show_on = show_on
        
        if(!label) {
            this.label = {
                en_US: value
            }
        } else {
            this.label = label
        }
    }
}

export interface CredentialFormSchema {
    variable: string
    label: I18nObject
    type: FormType
    required: boolean
    default?: string
    options?: FormOption[]
    placeholder?: I18nObject
    max_length: number
    show_on: FormShowOnObject[]
}

export interface ProviderCredentialSchema {
    credential_form_schemas: CredentialFormSchema[]
}

export interface FieldModelSchema {
    label: I18nObject
    placeholder?: I18nObject
}

export interface ModelCredentialSchema {
    model: FieldModelSchema
    credential_form_schemas: CredentialFormSchema[]
}

export interface SimpleProviderEntity {
    provider: string
    label: I18nObject
    icon_small? :I18nObject
    icon_large? :I18nObject
    models: AIModelEntity[]
}

export interface ProviderEntity {
    provider: string
    label: I18nObject
    description? :I18nObject
    icon_small? :I18nObject
    icon_large? :I18nObject
    background? :string
    models: ProviderModel[]
    provider_credential_schema? :ProviderCredentialSchema
    model_credential_schema? :ModelCredentialSchema
}