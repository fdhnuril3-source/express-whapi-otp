var express = require('express');
var router = express.Router();

// Model Import
const cacheMiddleware = require('../../config/middleware/cacheMiddleware');
const Model_produk = require('../../model/Model_produk'); // Sesuaikan jika foldernya 'models' atau 'model'
const { encryptData, decryptData } = require('../../config/crypto');
const kategoriQueue = require('../../config/middleware/queue');

// Modul Tambahan
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const redis = require('redis');

// 1. KONEKSI REDIS (Dilengkapi Proteksi Error)
const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error:', err));

(async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
    } catch (err) {
        console.error('Koneksi Redis Gagal (Pastikan Redis Server berjalan):', err.message);
    }
})();

// 2. KONFIGURASI MULTER (Upload Gambar)
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/'); 
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 3. ROUTE GET ALL PRODUK (Dengan Redis Cache)
// 3. ROUTE GET ALL PRODUK (Dengan Dekripsi)
router.get('/', cacheMiddleware, async function(req, res, next) {
    try {
        // Ambil data produk langsung dari model
        const produkList = await Model_produk.getAll(); // Sesuaikan dengan fungsi model Anda untuk mengambil data

        // Lakukan dekripsi pada field yang terenkripsi (misalnya nama_produk)
        const decryptedData = produkList.map(produk => {
            return {
                ...produk,
                nama_produk: decryptData(produk.nama_produk) // Mendekripsi kembali data dari database
            };
        });

        return res.status(200).json({
            status: true,
            message: 'Data Produk Berhasil Diambil',
            data: decryptedData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Gagal Mengambil Data'
        });
    }
});


// 4. ROUTE GET KATEGORI UNTUK FORM PRODUK
router.get('/create', async function(req, res) {
    try {
        let kategori = await Model_kategori.getAll(); 
        return res.status(200).json({
            status: true,
            message: 'Data kategori berhasil diambil',
            data: kategori
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

// 5. ROUTE POST STORE PRODUK
router.post('/store', upload.single('gambar_produk'), async function(req, res, next){
    try {
        let { nama_produk, harga, id_kategori } = req.body; 
        
        let Data = {
            nama_produk: nama_produk,
            harga: harga, 
            id_kategori: id_kategori,
            gambar_produk: req.file ? req.file.filename : null
        };
        
        await Model_produk.Store(Data);

        // Hapus cache setelah ada data baru
        if (client.isOpen) {
            await client.del('all_products');
        }

        return res.status(200).json({
            status: true,
            message: 'Data berhasil disimpan'
        });                                                                                                                                                                                                   
    } catch (error) {
        console.log(error); 
        return res.status(500).json({
            status: false,
            message: 'Gagal Menyimpan Data'
        });
    }
});

// 6. ROUTE GET PRODUK BY ID (EDIT)
router.get('/edit/:id', async function(req, res, next){
    try {
        let id = req.params.id;
        let rows = await Model_produk.getId(id);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ status: false, message: 'Data tidak ditemukan' });
        }

        let kategori = await Model_kategori.getAll();
        return res.status(200).json({
            status: true,
            message: 'Data produk berhasil diambil',
            data: {
                id: rows[0].id_produk,
                nama_produk: rows[0].nama_produk,
                harga: rows[0].harga,
                id_kategori: rows[0].id_kategori,
                gambar_produk: rows[0].gambar_produk,
                data_kategori: kategori
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

// 7. ROUTE POST UPDATE PRODUK
router.post('/update/:id', upload.single('gambar_produk'), async function(req, res, next){
    try {
        let id = req.params.id;
        let filebaru = req.file ? req.file.filename : null;
        let rows = await Model_produk.getId(id);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ status: false, message: 'Data tidak ditemukan' });
        }

        const namafilelama = rows[0].gambar_produk;

        if (filebaru && namafilelama) {
            const pathFilelama = path.join(__dirname, '../../public/images/', namafilelama);
            if (fs.existsSync(pathFilelama)) {
                fs.unlinkSync(pathFilelama);
            }
        }

        let { nama_produk, harga, id_kategori } = req.body;
        let gambar_produk = filebaru || namafilelama;
        let Data = {
            nama_produk,
            harga,
            id_kategori,
            gambar_produk    
        };

        await Model_produk.update(id, Data);

        if (client.isOpen) {
            await client.del('all_products');
        }

        return res.status(200).json({
            status: true,
            message: 'Data berhasil diperbarui'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan: ' + error.message
        });
    }
});

// 8. ROUTE GET DELETE PRODUK
router.get('/delete/:id', async function(req, res){
    try {
        let id = req.params.id;
        let rows = await Model_produk.getId(id);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ status: false, message: 'Data tidak ditemukan' });
        }

        const namafilelama = rows[0].gambar_produk;

        if (namafilelama) {
            const pathFilelama = path.join(__dirname, '../../public/images/', namafilelama);
            if (fs.existsSync(pathFilelama)) {
                fs.unlinkSync(pathFilelama);
            }
        }

        await Model_produk.delete(id);

        if (client.isOpen) {
            await client.del('all_products');
        }

        return res.status(200).json({
            status: true,
            message: 'Data berhasil dihapus'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Gagal menghapus'
        });
    }

    router.get('/', compressionMiddleware, async (req, res) => {
    try {
        const rows = await Model_Produk.getAll();
        return res.status(200).json({
            status: true,
            message: 'Data Produk',
            data: rows
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Gagal mengambil data',
            error: err
        });
    }
});

});

module.exports = router;