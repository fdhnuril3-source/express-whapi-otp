var express = require('express');
const connection = require('../config/database');
const Model_produk = require('../model/Model_produk');
const Model_kategori = require('../model/Model_kategori');
var router = express.Router();

const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/'); 
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

router.get('/', async function(req, res, next){
    let rows = await Model_produk.getAll();
    res.render('produk/index', {
        judul : 'Halaman Produk',
        data: rows
    });
});

router.get('/create', async function(req, res) {
    let kategori = await Model_kategori.getAll(); 
    res.render('produk/create', {
        data_kategori: kategori
    }); 
});

router.post('/store', upload.single('gambar_produk'), async function(req, res, next){
    try {
        let { nama_produk, harga, id_kategori } = req.body; 
        
        let Data = {
            nama_produk: nama_produk,
            harga: harga, 
            id_kategori: id_kategori,
            gambar_produk: req.file ? req.file.filename : null
        }
        
        await Model_produk.Store(Data);
        req.flash('success', 'Berhasil Menyimpan Data');
        res.redirect('/produk');
    } catch (error) {
        console.log(error); 
        req.flash('error', 'Gagal Menyimpan Data');
        res.redirect('/produk');
    }
});


router.get('/edit/(:id)', async function(req, res, next){
    let id = req.params.id;
    let rows = await Model_produk.getId(id);
    let kategori = await Model_kategori.getAll();
    res.render('produk/edit', {
        id: rows[0].id_produk,
        nama_produk: rows[0].nama_produk,
        harga: rows[0].harga,
        id_kategori: rows[0].id_kategori,
        gambar_produk: rows[0].gambar_produk,
        data_kategori: kategori
    });
});

router.post('/update/(:id)', upload.single('gambar_produk'), async function(req, res, next){
    try {
        let id = req.params.id;
        let filebaru = req.file ? req.file.filename : null;
        let rows = await Model_produk.getId(id);
        const namafilelama = rows[0].gambar_produk;

        // Hapus file lama jika ada file baru
        if(filebaru && namafilelama){
            const pathFilelama = path.join(__dirname, '../public/images/', namafilelama);
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
        }
        await Model_produk.update(id, Data);
        req.flash('success', 'Berhasil Memperbarui Data');
        res.redirect('/produk');
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan: ' + error.message);
        res.redirect('/produk');
    }
});

router.get('/delete/(:id)', async function(req, res){
    try {
        let id = req.params.id;
        let rows = await Model_produk.getId(id);
        const namafilelama = rows[0].gambar_produk;

        if(namafilelama){
            const pathFilelama = path.join(__dirname, '../public/images/', namafilelama);
            if (fs.existsSync(pathFilelama)) {
                fs.unlinkSync(pathFilelama);
            }
        }

        await Model_produk.delete(id);
        req.flash('success', 'Data terhapus');
        res.redirect('/produk');
    } catch (error) {
        req.flash('error', 'Gagal menghapus');
        res.redirect('/produk');
    }
});

module.exports = router;