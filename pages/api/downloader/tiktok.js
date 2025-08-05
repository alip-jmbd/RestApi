// pages/api/downloader/tiktok.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed (use GET)' });
    }
    const { url } = req.query;
    if (!url || !/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(url)) {
        return res.status(400).json({ success: false, error: 'Bad Request: Invalid or missing TikTok URL' });
    }

    try {
        const { data } = await axios.get('https://tiktok-scraper7.p.rapidapi.com', {
            headers: {
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
                'X-RapidAPI-Key': 'ca5c6d6fa3mshfcd2b0a0feac6b7p140e57jsn72684628152a' // PERHATIAN: Kunci API sebaiknya disimpan di environment variable
            },
            params: { url, hd: '1' }
        });
        res.status(200).json({ success: true, ...data.data });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
