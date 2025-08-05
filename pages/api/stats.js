import { getRequestCounts } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const stats = await getRequestCounts();
        res.status(200).json(stats);
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
