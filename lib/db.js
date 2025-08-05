import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function getRequestCounts() {
    try {
        const total = await kv.get('total_requests') || 0;
        const today = await kv.get('today_requests') || 0;
        const lastUpdated = await kv.get('last_updated_date') || '1970-01-01';
        
        const currentDate = new Date().toISOString().split('T')[0];

        if (currentDate !== lastUpdated) {
            await kv.set('today_requests', 0);
            await kv.set('last_updated_date', currentDate);
            return { total_requests: total, today_requests: 0 };
        }

        return { total_requests: total, today_requests: today };
    } catch (error) {
        console.error("Error getting request counts:", error);
        return { total_requests: 0, today_requests: 0 };
    }
}

export async function incrementRequestCount() {
    try {
        await getRequestCounts();
        await kv.incr('total_requests');
        await kv.incr('today_requests');
    } catch (error) {
        console.error("Error incrementing request count:", error);
    }
}
