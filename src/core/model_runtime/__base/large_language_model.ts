import { PARAMETER_RULE_TEMPLATE } from "./default"
import { PromptMessage, PromptMessageTool } from "./entities"
import { LLMResultChunk } from "./llm_entities"
import { AIModelEntity, DefaultParameterName, ParameterRule, ParameterType } from "./model_entities"

export abstract class MessageCallback {
    abstract onMessage(message: LLMResultChunk): void

    abstract onEnd(): void

    abstract onError(e: any): void
}

export class LargeLanguageModel {
    model_schemas: AIModelEntity[]

    constructor(model_schemas: AIModelEntity[]) {
        this.model_schemas = model_schemas
    }
    
    _invoke(model: string, credentials: {[key: string]: string}, 
            prompt_messages: PromptMessage[], model_parameters: {[key: string]: any},
            tools?: PromptMessageTool[], stop?: string[],
            callbacks?: MessageCallback[]): void {}

    _validate_credentials(model: string, credentials: { [key: string]: string; }): Promise<boolean> {
        return Promise.reject<boolean>()
    }

    invoke(model: string, credentials: {[key: string]: string}, 
        prompt_messages: PromptMessage[], model_parameters: {[key: string]: any},
        tools?: PromptMessageTool[], stop?: string[],
        callbacks?: MessageCallback[]
    ): void {
        if (!model_parameters) {
            model_parameters = {}
        }

        model_parameters = this._validate_and_filter_model_parameters(model, model_parameters, credentials)
        this._invoke(model, credentials, prompt_messages, model_parameters, tools, stop, callbacks)
    }

    validate_credentials(model: string, credentials: { [key: string]: string; }) {
        return this._validate_credentials(model, credentials)
    }

    _validate_and_filter_model_parameters(model: string, model_parameters: {[key: string]: any}, 
        credentials: {[key: string]: string}
    ): {[key: string]: string} {
        const parameter_rules = this.get_parameter_rules(model, credentials)
        const filtered_model_parameters: {[key: string]: any} = {}

        for (const parameter_rule of parameter_rules) {
            let parameter_name = parameter_rule.name;
            let parameter_value = model_parameters[parameter_name];
    
            if (!parameter_value) {
                if (parameter_rule.use_template && model_parameters[parameter_rule.use_template]) {
                    // if parameter value is None, use template value variable name instead
                    parameter_value = model_parameters[parameter_rule.use_template];
                } else {
                    if (parameter_rule.required) {
                        if (parameter_rule.default !== null && parameter_rule.default !== undefined) {
                            filtered_model_parameters[parameter_name] = parameter_rule.default;
                            continue;
                        } else {
                            throw new Error(`Model Parameter ${parameter_name} is required.`);
                        }
                    } else {
                        continue;
                    }
                }
            }
    
            // validate parameter value type
            switch (parameter_rule.type) {
                case ParameterType.INT:
                    if (typeof parameter_value !== 'number' || !Number.isInteger(parameter_value)) {
                        throw new Error(`Model Parameter ${parameter_name} should be int.`);
                    }
    
                    // validate parameter value range
                    if (parameter_rule.min && parameter_value < parameter_rule.min) {
                        throw new Error(`Model Parameter ${parameter_name} should be greater than or equal to ${parameter_rule.min}.`);
                    }
    
                    if (parameter_rule.max && parameter_value > parameter_rule.max) {
                        throw new Error(`Model Parameter ${parameter_name} should be less than or equal to ${parameter_rule.max}.`);
                    }
                    break;
                case ParameterType.FLOAT:
                    if (typeof parameter_value !== 'number') {
                        throw new Error(`Model Parameter ${parameter_name} should be float.`);
                    }
    
                    // validate parameter value precision
                    if (parameter_rule.precision !== null) {
                        if (parameter_rule.precision === 0) {
                            if (parameter_value !== Math.floor(parameter_value)) {
                                throw new Error(`Model Parameter ${parameter_name} should be int.`);
                            }
                        } else {
                            if (parameter_value !== parseFloat(parameter_value.toFixed(parameter_rule.precision))) {
                                throw new Error(`Model Parameter ${parameter_name} should be round to ${parameter_rule.precision} decimal places.`);
                            }
                        }
                    }
    
                    // validate parameter value range
                    if (parameter_rule.min && parameter_value < parameter_rule.min) {
                        throw new Error(`Model Parameter ${parameter_name} should be greater than or equal to ${parameter_rule.min}.`);
                    }
    
                    if (parameter_rule.max && parameter_value > parameter_rule.max) {
                        throw new Error(`Model Parameter ${parameter_name} should be less than or equal to ${parameter_rule.max}.`);
                    }
                    break;
                case ParameterType.BOOLEAN:
                    if (typeof parameter_value !== 'boolean') {
                        throw new Error(`Model Parameter ${parameter_name} should be bool.`);
                    }
                    break;
                case ParameterType.STRING:
                    if (typeof parameter_value !== 'string') {
                        throw new Error(`Model Parameter ${parameter_name} should be string.`);
                    }
    
                    // validate options
                    if (parameter_rule.options && !parameter_rule.options.includes(parameter_value)) {
                        throw new Error(`Model Parameter ${parameter_name} should be one of ${parameter_rule.options}.`);
                    }
                    break;
                default:
                    throw new Error(`Model Parameter ${parameter_name} type ${parameter_rule.type} is not supported.`);
            }
    
            filtered_model_parameters[parameter_name] = parameter_value;
        }

        return filtered_model_parameters
    }

    get_parameter_rules(model: string, credentials: any): ParameterRule[] {
        const model_schema = this.get_model_schema(model, credentials)
        if (model_schema) {
            return model_schema.parameter_rules
        }

        return []
    }

    get_model_schema(model: string, credentials: any): AIModelEntity | null {
        // get predefined models
        const models = this.predefined_models();
    
        const modelMap: {[key: string]: AIModelEntity} = {};
        for (const modelObj of models) {
            modelMap[modelObj.model] = modelObj;
        }
    
        if (model in modelMap) {
            return modelMap[model];
        }
    
        if (credentials) {
            const modelSchema = this.get_customizable_model_schema_from_credentials(model, credentials);
            if (modelSchema) {
                return modelSchema;
            }
        }
    
        return null;
    }

    predefined_models() {
        return this.model_schemas
    }
    
    get_customizable_model_schema_from_credentials(model: string, credentials: any): AIModelEntity | null {
        return null
    }

    get_customizable_model_schema(model: string, credentials: any) {
        /**
         * Get customizable model schema and fill in the template
         */
        let schema = this._get_customizable_model_schema(model, credentials);
    
        if (!schema) {
            return null;
        }
    
        // fill in the template
        const new_parameter_rules = [];
        for (const parameter_rule of schema.parameter_rules) {
            if (parameter_rule.use_template) {
                try {
                    const default_parameter_name = parameter_rule.use_template;
                    const default_parameter_rule = this._get_default_parameter_rule_variable_map(default_parameter_name as DefaultParameterName);
    
                    if (!parameter_rule.max && 'max' in default_parameter_rule) {
                        parameter_rule.max = default_parameter_rule['max'];
                    }
                    if (!parameter_rule.min && 'min' in default_parameter_rule) {
                        parameter_rule.min = default_parameter_rule['min'];
                    }
                    if (!parameter_rule.default && 'default' in default_parameter_rule) {
                        parameter_rule.default = default_parameter_rule['default'];
                    }
                    if (!parameter_rule.precision && 'precision' in default_parameter_rule) {
                        parameter_rule.precision = default_parameter_rule['precision'];
                    }
                    if (!parameter_rule.required && 'required' in default_parameter_rule) {
                        parameter_rule.required = default_parameter_rule['required'];
                    }
                } catch (error) {
                    throw error;
                }
            }
    
            new_parameter_rules.push(parameter_rule);
        }
    
        schema.parameter_rules = new_parameter_rules;
    
        return schema;
    }

    _get_default_parameter_rule_variable_map(name: DefaultParameterName) {
        const default_parameter_rule = PARAMETER_RULE_TEMPLATE[name];
    
        if (!default_parameter_rule) {
            throw new Error(`Invalid model parameter rule name ${name}`);
        }
    
        return default_parameter_rule;
    }
    

    _get_customizable_model_schema(model: string, credentials: any): AIModelEntity | null {
        return null;
    }
}
