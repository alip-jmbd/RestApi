import { getRequestCounts } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const stats = await getRequestCounts();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve stats' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
