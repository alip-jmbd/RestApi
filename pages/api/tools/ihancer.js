import axios from 'axios';
import FormData from 'form-data';
import { formidable } from 'formidable';
import fs from 'fs/promises';
import { incrementRequestCount } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    
    try {
        const form = formidable({});
        const [fields, files] = await form.parse(req);
        
        let buffer;
        let originalFilename = `rynn_${Date.now()}.jpg`;

        if (files.file?.[0]) {
            const file = files.file[0];
            buffer = await fs.readFile(file.filepath);
            originalFilename = file.originalFilename || originalFilename;
            await fs.unlink(file.filepath);
        } else if (fields.url?.[0]) {
            const imageUrl = fields.url[0];
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            buffer = response.data;
        } else {
            return res.status(400).json({ error: 'File upload atau URL gambar diperlukan.' });
        }

        const method = fields.method?.[0] || '1';
        const size = fields.size?.[0] || 'low';

        const apiForm = new FormData();
        apiForm.append('method', method);
        apiForm.append('is_pro_version', 'false');
        apiForm.append('is_enhancing_more', 'false');
        apiForm.append('max_image_size', size);
        apiForm.append('file', buffer, originalFilename);
        
        const { data } = await axios.post('https://ihancer.com/api/enhance', apiForm, {
            headers: { ...apiForm.getHeaders(), 'user-agent': 'Dart/3.5 (dart:io)' },
            responseType: 'arraybuffer'
        });
        
        await incrementRequestCount();
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(data));
    } catch (error) {
        const errorMessage = error.response ? error.response.data.toString() : error.message;
        res.status(500).json({ success: false, error: 'Internal Server Error', details: errorMessage });
    }
}
