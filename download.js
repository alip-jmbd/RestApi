const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFile() {
    // Ambil argumen dari command line.
    // process.argv[2] adalah argumen pertama setelah nama script.
    const url = process.argv[2];
    const fileName = process.argv[3];

    // Validasi input dari pengguna
    if (!url || !fileName) {
        console.error('Kesalahan: URL dan Nama File harus disediakan.');
        console.error('Penggunaan: node download.js <URL_FILE> <NAMA_FILE_DI_FOLDER_PUBLIC>');
        console.error('Contoh: node download.js https://example.com/video.mp4 banner.mp4');
        process.exit(1); // Keluar dari script karena error
    }

    // Tentukan path lengkap untuk menyimpan file di dalam folder 'public'
    const filePath = path.resolve(__dirname, 'public', fileName);

    console.log(`Mendownload dari: ${url}`);
    console.log(`Menyimpan sebagai: ${filePath}`);

    try {
        // Pastikan folder 'public' ada
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

        // Gunakan stream untuk efisiensi download file besar (seperti video)
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`\nDownload selesai! File disimpan sebagai 'public/${fileName}'.`);
                resolve();
            });
            writer.on('error', (err) => {
                console.error('\nTerjadi kesalahan saat menulis file:', err.message);
                reject(err);
            });
        });
    } catch (error) {
        console.error(`\nGagal mengunduh file. Periksa URL atau koneksi Anda. Error: ${error.message}`);
    }
}

// Jalankan fungsi utama
downloadFile();
