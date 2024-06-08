export const PARAMETER_RULE_TEMPLATE = {
    'temperature': {
        'label': {
            'en_US': 'Temperature',
            'zh_Hans': '温度',
        },
        'type': 'float',
        'help': {
            'en_US': 'Controls randomness. Lower temperature results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive. Higher temperature results in more random completions.',
            'zh_Hans': '温度控制随机性。较低的温度会导致较少的随机完成。随着温度接近零，模型将变得确定性和重复性。较高的温度会导致更多的随机完成。',
        },
        'required': false,
        'default': 0.0,
        'min': 0.0,
        'max': 1.0,
        'precision': 2,
    },
    'top_p': {
        'label': {
            'en_US': 'Top P',
            'zh_Hans': 'Top P',
        },
        'type': 'float',
        'help': {
            'en_US': 'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.',
            'zh_Hans': '通过核心采样控制多样性：0.5表示考虑了一半的所有可能性加权选项。',
        },
        'required': false,
        'default': 1.0,
        'min': 0.0,
        'max': 1.0,
        'precision': 2,
    },
    'presence_penalty': {
        'label': {
            'en_US': 'Presence Penalty',
            'zh_Hans': '存在惩罚',
        },
        'type': 'float',
        'help': {
            'en_US': 'Applies a penalty to the log-probability of tokens already in the text.',
            'zh_Hans': '对文本中已有的标记的对数概率施加惩罚。',
        },
        'required': false,
        'default': 0.0,
        'min': 0.0,
        'max': 1.0,
        'precision': 2,
    },
    'frequency_penalty': {
        'label': {
            'en_US': 'Frequency Penalty',
            'zh_Hans': '频率惩罚',
        },
        'type': 'float',
        'help': {
            'en_US': 'Applies a penalty to the log-probability of tokens that appear in the text.',
            'zh_Hans': '对文本中出现的标记的对数概率施加惩罚。',
        },
        'required': false,
        'default': 0.0,
        'min': 0.0,
        'max': 1.0,
        'precision': 2,
    },
    'max_tokens': {
        'label': {
            'en_US': 'Max Tokens',
            'zh_Hans': '最大标记',
        },
        'type': 'int',
        'help': {
            'en_US': 'Specifies the upper limit on the length of generated results. If the generated results are truncated, you can increase this parameter.',
            'zh_Hans': '指定生成结果长度的上限。如果生成结果截断，可以调大该参数。',
        },
        'required': false,
        'default': 64,
        'min': 1,
        'max': 2048,
        'precision': 0,
    }
};
