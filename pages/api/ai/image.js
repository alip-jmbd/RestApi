import axios from 'axios';
import { incrementRequestCount } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    const { prompt, style = 'default', size = '1:1' } = req.query;
    const sizeList = { '1:1': '1024x1024', '3:2': '1080x720', '2:3': '720x1080' };
    const styleList = { 'default': '-style Realism', 'ghibli': '-style Ghibli Art', 'cyberpunk': '-style Cyberpunk', 'anime': '-style Anime', 'portrait': '-style Portrait', '3d': '-style 3D' };
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });

    try {
        const device_id = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const apiResponse = await axios.post('https://api-preview.apirouter.ai/api/v1/deepimg/flux-1-dev', {
            device_id,
            prompt: prompt + ' ' + (styleList[style] || ''),
            size: sizeList[size],
            n: '1',
            output_format: 'png'
        }, {
            headers: {
                origin: 'https://deepimg.ai',
                referer: 'https://deepimg.ai/'
            }
        });
        
        const imageUrl = apiResponse.data.data.images[0].url;
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        await incrementRequestCount();
        res.setHeader('Content-Type', 'image/png');
        res.send(imageResponse.data);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to generate image', details: error.message });
    }
}
