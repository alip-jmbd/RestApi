import axios from 'axios';
import { incrementRequestCount } from '../../../lib/db';

function parseStreamingResponse(data) {
    let fullText = '';
    const lines = data.split('\n\n').filter(line => line.trim().startsWith('data:'));
    for (const line of lines) {
        const jsonPart = line.substring(6).trim();
        if (jsonPart === '[DONE]') continue;
        try {
            const parsed = JSON.parse(jsonPart);
            if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                fullText += parsed.choices[0].delta.content;
            }
        } catch (e) {}
    }
    const thinkMatch = fullText.match(/<think>([\s\S]*?)<\/think>/);
    return {
        think: thinkMatch ? thinkMatch[1].trim() : '',
        response: fullText.replace(/<think>[\s\S]*?<\/think>/, '').trim()
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    const { question, model = 'grok-3-mini' } = req.query;
    const _model = ['grok-3-mini', 'gpt-4o', 'llama-3.3', 'claude-3.7'];
    if (!question) return res.status(400).json({ success: false, error: 'Question is required' });
    if (!_model.includes(model)) return res.status(400).json({ success: false, error: `Invalid model. Available: ${_model.join(', ')}` });

    try {
        const { data } = await axios.post('https://api.appzone.tech/v1/chat/completions', {
            messages: [{ role: 'user', content: [{ type: 'text', text: question }] }],
            model: model,
            isSubscribed: true
        }, {
            headers: {
                authorization: 'Bearer az-chatai-key',
                'content-type': 'application/json'
            }
        });

        const processedResult = parseStreamingResponse(data);
        await incrementRequestCount();
        res.status(200).json({ success: true, ...processedResult });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        res.status(500).json({ success: false, error: 'Upstream API Error', details: errorMessage });
    }
}
