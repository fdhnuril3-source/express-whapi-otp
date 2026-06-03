var express = require('express');
const Model_kategori = require('../../model/Model_kategori');
var router = express.Router();

router.get('/', async function(req, res, next){
    let rows = await Model_kategori.getAll();
        return res.status(200).json({
            status: true,
            massages :'Data Kategori',
            data: rows
        });
    });

router.get('/create', function(req, res, next){
    res.render('kategori/create',{
            judul : 'Halaman Kategori',
    });
});

router.get('/data/(:id)', async function(req, res, next){
    let id = req.params.id;
    let rows =  await Model_kategori.getId(id);
    returnres.status(200).json({
                id: rows[0].id_kategori,
                nama_kategori: rows[0].nama_kategori
            });
    
})

router.post('/store', function(req, res, next) {
    try {
        let { nama_kategori } = req.body;

        let Data = {
            nama_kategori: nama_kategori
        };

        connection.query('INSERT INTO kategori SET ?', Data, function(err, result) {
            if (err) {
                req.flash('error', 'Gagal Menyimpan Data');
                return res.status(500).json({
                    status: false,
                    message: 'Gagal menyimpan data'
                });
            }

            req.flash('success', 'Berhasil Menyimpan Data');
            return res.status(200).json({
                status: true,
                message: 'Data berhasil disimpan'
            });
        });

    } catch (error) {
        req.flash('error', 'Terjadi kesalahan');
        return res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan'
        });
    }
});
router.post('/update/:id', async function(req, res) {
    try {
        let id = req.params.id;
        let { nama_kategori } = req.body;

        let Data = {
            nama_kategori: nama_kategori
        };

        await Model_kategori.update(id, Data);

        return res.status(200).json({
            status: true,
            message: 'Data berhasil diupdate'
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Data gagal diupdate'
        });
    }
});

router.get('/delete/(:id)', async function(req, res){
    let id = req.params.id;
    await Model_kategori.delete(id);
         return res.status(200).json({
            status: true,
            message: 'Data berhasil dihapus'
        });
});
    


module.exports = router;