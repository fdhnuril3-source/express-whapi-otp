var express = require('express');
var router = express.Router();
var connection = require('../config/database');

router.get('/',function(req,res,next){
    connection.query('SELECT*FROM biodata ORDER BY id_biodata DESC', function(err,rows){
        if (err){
            return res.status(500).send('Kesalahan Database:'+err.message);
        }
        res.render('biodata/index',{
            title:'Halaman Biodata Mahasiswa',
            data:rows
        });
    });
});

module.exports = router;