const express = require("express");
const router = express.Router();
const connection = require("../config/database");
const Model_mahasiswa = require("../model/Model_mahasiswa");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Konfigurasi Penyimpanan Foto
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = "public/images/mahasiswa/"; 
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});
const upload = multer({ storage: storage });

// 1. RUTE INDEX (Tampilkan Semua Data)
router.get('/', async function(req, res, next) {
    try {
        let rows = await Model_mahasiswa.getAll();
        res.render('mahasiswa/index', {
            mahasiswa: rows
        });
    } catch (err) {
        next(err);
    }
});

// 2. RUTE CREATE (Tampilkan Form Tambah)
// TARUH DI ATAS EDIT/DELETE BIAR TIDAK 404
router.get('/create', function(req, res, next) {
    res.render('mahasiswa/create');
});

// 3. RUTE STORE (Proses Simpan Data)
router.post('/store', upload.single('foto_mahasiswa'), async function(req, res, next) {
    try {
        let { nrp, nama, jenis_kelamin } = req.body;
        let foto = req.file ? req.file.filename : null;

        let data = {
            nrp,
            nama,
            jenis_kelamin,
            foto_mahasiswa: foto
        };

        await connection.query("INSERT INTO mahasiswa SET ?", data);
        req.flash("success", "Data berhasil disimpan!");
        res.redirect("/mahasiswa");
    } catch (err) {
        next(err);
    }
});

// 4. RUTE EDIT (Tampilkan Form Edit)
router.get("/edit/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let rows = await Model_mahasiswa.getId(id);
        res.render("mahasiswa/edit", {
            id: id,
            nrp: rows[0].nrp,
            nama: rows[0].nama,
            jenis_kelamin: rows[0].jenis_kelamin,
            foto: rows[0].foto_mahasiswa
        });
    } catch (err) {
        next(err);
    }
});

// 5. RUTE UPDATE (Proses Ubah Data)
router.post("/update/:id", upload.single("foto_mahasiswa"), async function (req, res, next) {
    try {
        let id = req.params.id;
        let { nrp, nama, jenis_kelamin } = req.body;
        let filebaru = req.file ? req.file.filename : null;

        let rows = await Model_mahasiswa.getId(id);
        let namafilelama = rows[0].foto_mahasiswa;

        if (filebaru && namafilelama) {
            const pathfilelama = path.join(__dirname, '../public/images/mahasiswa/', namafilelama);
            if (fs.existsSync(pathfilelama)) fs.unlinkSync(pathfilelama);
        }

        let dataUpdate = {
            nrp,
            nama,
            jenis_kelamin,
            foto_mahasiswa: filebaru || namafilelama
        };

        await connection.query("UPDATE mahasiswa SET ? WHERE id_mahasiswa = ?", [dataUpdate, id]);
        req.flash("success", "Data berhasil diupdate!");
        res.redirect("/mahasiswa");
    } catch (err) {
        next(err);
    }
});

// 6. RUTE DELETE (Proses Hapus Data)
router.get("/delete/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let rows = await Model_mahasiswa.getId(id);
        let namafilelama = rows[0].foto_mahasiswa;

        if (namafilelama) {
            const pathfilelama = path.join(__dirname, '../public/images/mahasiswa/', namafilelama);
            if (fs.existsSync(pathfilelama)) fs.unlinkSync(pathfilelama);
        }

        await Model_mahasiswa.delete(id);
        req.flash("success", "Data berhasil dihapus!");
        res.redirect("/mahasiswa");
    } catch (err) {
        next(err);
    }
});

module.exports = router;