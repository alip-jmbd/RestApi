import axios from 'axios';
import { incrementRequestCount } from '../../../lib/db';

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url || !/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(url)) {
        return res.status(400).json({ success: false, error: 'Bad Request: Invalid or missing TikTok URL' });
    }

    try {
        const { data } = await axios.get('https://tiktok-scraper7.p.rapidapi.com', {
            headers: {
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
                'X-RapidAPI-Key': 'ca5c6d6fa3mshc5f2aacec619c44p16f219jsn72684628152a'
            },
            params: { url, hd: '1' }
        });
        
        await incrementRequestCount();
        res.status(200).json({ success: true, ...data.data });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
