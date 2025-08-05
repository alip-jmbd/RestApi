export const allEndpoints = [{
        id: 'gpt4',
        name: 'GPT-4',
        category: 'AI',
        method: 'GET',
        path: '/api/ai/gpt4',
        params: [{
            name: 'prompt',
            type: 'text',
            required: true,
            placeholder: 'Contoh: Halo, apa kabar?'
        }]
    },
    {
        id: 'chatai',
        name: 'Chat AI',
        category: 'AI',
        method: 'GET',
        path: '/api/ai/chat',
        params: [{
            name: 'question',
            type: 'text',
            required: true,
            placeholder: 'Contoh: Siapa penemu bola lampu?'
        }, {
            name: 'model',
            type: 'select',
            required: false,
            options: ['grok-3-mini', 'gpt-4o', 'llama-3.3', 'claude-3.7'],
            default: 'grok-3-mini'
        }]
    },
    {
        id: 'imagegen',
        name: 'Image Generation',
        category: 'AI Image',
        method: 'GET',
        path: '/api/ai/image',
        params: [{
            name: 'prompt',
            type: 'text',
            required: true,
            placeholder: 'Contoh: kucing putih memakai kacamata'
        }, {
            name: 'style',
            type: 'select',
            required: false,
            options: ['default', 'anime', 'ghibli', 'cyberpunk', '3d', 'portrait'],
            default: 'default'
        }, {
            name: 'size',
            type: 'select',
            required: false,
            options: ['1:1', '3:2', '2:3'],
            default: '1:1'
        }]
    },
    {
        id: 'ihancer',
        name: 'iHancer',
        category: 'Tools',
        method: 'POST',
        path: '/api/tools/ihancer',
        params: [{
            name: 'url',
            type: 'text',
            required: false,
            placeholder: 'Atau tempel URL gambar di sini'
        }, {
            name: 'file',
            type: 'file',
            required: false
        }, {
            name: 'method',
            type: 'select',
            required: false,
            options: [1, 2, 3, 4],
            default: 1
        }, {
            name: 'size',
            type: 'select',
            required: false,
            options: ['low', 'medium', 'high'],
            default: 'low'
        }]
    },
    {
        id: 'stats',
        name: 'View API Stats',
        category: 'Tools',
        method: 'GET',
        path: '/api/stats',
        params: []
    },
    {
        id: 'aio',
        name: 'All In One Downloader',
        category: 'Downloader',
        method: 'GET',
        path: '/api/downloader/aio',
        params: [{
            name: 'url',
            type: 'text',
            required: true,
            placeholder: 'Contoh: URL Spotify, TikTok, IG, dll.'
        }]
    },
    {
        id: 'tiktok',
        name: 'TikTok Downloader',
        category: 'Downloader',
        method: 'GET',
        path: '/api/downloader/tiktok',
        params: [{
            name: 'url',
            type: 'text',
            required: true,
            placeholder: 'URL TikTok'
        }]
    },
].sort((a, b) => a.name.localeCompare(b.name));
