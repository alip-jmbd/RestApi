import axios from 'axios';
import { incrementRequestCount } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
    const { prompt } = req.query;
    if (!prompt) {
        return res.status(400).json({ success: false, error: 'Bad Request: prompt parameter is missing' });
    }

    try {
        const { data } = await axios.post('https://us-central1-openaiprojects-1fba2.cloudfunctions.net/chat_gpt_ai/api.live.text.gen', {
            model: 'gpt-4o-mini',
            temperature: 0.2,
            top_p: 0.2,
            prompt: prompt
        }, {
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            }
        });
        
        const result = data.choices[0].message.content;
        await incrementRequestCount();
        res.status(200).json({ success: true, model: "gpt-4", result });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
