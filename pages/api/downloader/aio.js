import axios from 'axios';
import { incrementRequestCount } from '../../../lib/db';

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    try {
        const { data } = await axios.post('https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink', {
            url
        }, {
            headers: {
                'x-rapidapi-host': 'auto-download-all-in-one.p.rapidapi.com',
                'x-rapidapi-key': '1dda0d29d3mshc5f2aacec619c44p16f219jsn99a62a516f98'
            }
        });
        await incrementRequestCount();
        res.status(200).json(data);
    } catch (error) {
        const errData = error.response ? error.response.data : { message: error.message };
        res.status(500).json({ error: 'API request failed', details: errData });
    }
}
