import { defineOperationApp } from '@directus/extensions-sdk';
export default defineOperationApp({
    id: 'extract-text-from-image',
    name: 'Extract text from image',
    icon: 'image_search',
    description: 'Detect text in an image with AI',
    overview: ({ api }) => [
        {
            label: 'API',
            text: api !== null && api !== void 0 ? api : 'tencent-ocr',
        },
    ],
    options: [
        {
            field: 'api',
            name: 'API',
            type: 'string',
            schema: {
                default_value: 'tencent-ocr',
            },
            meta: {
                interface: 'select-dropdown',
                width: 'half',
                options: {
                    choices: [
                        {
                            text: 'Tencent-Ocr',
                            value: 'tencent-ocr',
                        },
                        // {
                        // 	text: 'Azure Vision AI',
                        // 	value: 'azure-vision-ai',
                        // }
                    ],
                },
            },
        },
        {
            field: 'field',
            name: '$t:field',
            type: 'string',
            meta: {
                interface: 'input',
                width: 'half',
                options: {
                    iconRight: 'key',
                    font: 'monospace',
                    placeholder: '{{$trigger.key}}'
                },
            },
            schema: {
                default_value: '{{$trigger.key}}',
            },
        },
    ],
});
