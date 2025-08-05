import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

export async function getRequestCounts() {
    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return { total_requests: 0, today_requests: 0, last_updated_date: '1970-01-01' };
    }
}

export async function incrementRequestCount() {
    const stats = await getRequestCounts();
    const today = new Date().toISOString().split('T')[0];

    stats.total_requests += 1;

    if (stats.last_updated_date === today) {
        stats.today_requests += 1;
    } else {
        stats.today_requests = 1;
        stats.last_updated_date = today;
    }
    
    await fs.writeFile(dbPath, JSON.stringify(stats, null, 2));
}
