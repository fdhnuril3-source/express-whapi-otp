var express = require('express');
const connection = require('../config/database');
const Model_kategori = require('../model/Model_kategori');
var router = express.Router();
var verifyToken = require('../config/middleware/verifyToken');

router.get('/', verifyToken, async function(req, res, next){
    let rows = await Model_kategori.getAll();
        return res.status(200).json({
            status: true,   
            massages :'Data Kategori',
            data: rows
        });
    });

router.get('/', async function(req, res, next){
    let rows = await Model_kategori.getAll();
        res.render('kategori/index',
            {
                judul : 'Halaman Kategori',
                data: rows
            });
        });


router.get('/create', function(req, res, next){
    res.render('kategori/create');
});

router.get('/edit/(:id)', async function(req, res, next){
    let id = req.params.id;
    let rows =  await Model_kategori.getId(id);
     res.render('kategori/edit', {
                id: rows[0].id_kategori,
                nama_kategori: rows[0].nama_kategori
            });
    
})

router.post('/store', function(req, res, next){
    let {nama_kategori}= req.body;
        let Data = {
            nama_kategori
        }
    connection.query('insert into kategori set ?', Data, function(err, result){
        if (err) {
            req.flash('error', 'Gagal Menyimpan Data');
        } else {
            req.flash('success', 'Berhasil Menyimpan Data');
        }
        res.redirect('/kategori');
    })
        
})

router.post('/update/(:id)',async function(req, res, next){
    try {
        let id = req.params.id;
        let {nama_kategori}= req.body;
        let Data = {
            nama_kategori
        }
    await Model_kategori.update(id,Data);
    req.flash('success', 'Berhasil Memperbarui Data');
     res.redirect('/kategori');

} catch (error) {
    req.flash('error', 'Terjadi kesalahan');
    res.redirect('/kategori');
}
})

router.get('/delete/(:id)', async function(req, res){
    let id = req.params.id;
    await Model_kategori.delete(id);
        req.flash('success', 'Data terhapus');
        res.redirect('/kategori');
    })
    


module.exports = router;