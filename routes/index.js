var express = require('express');
var router = express.Router(); // (Atau menggunakan const app = express(); tergantung struktur project Anda)
const bcrypt = require('bcryptjs');
const Model_users = require('../model/Model_users');

// --- TAMBAHKAN PEMANGGIL RUTE WHATSAPP DI SINI ---
const whatsappRoutes = require('./api/whatsapp'); // Sesuaikan path jika letaknya berbeda
// ------------------------------------------------

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'prabowo',
    wapres: 'gibran'
  });
});

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

router.post('/saveusers', async function(req, res, next) {
  try {
    let { email, password } = req.body;
    let enkripsi = await bcrypt.hash(password, 10);
    let Data = {
      email,
      password: enkripsi
    };
    await Model_users.store(Data);
    req.flash('success', 'Registrasi users berhasil');
    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'Gagal registrasi');
    res.redirect('/register');
  }
});

router.post('/log', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let Data = await Model_users.login(email);
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      if (cek) {
        req.session.userId = Data[0].id_users;
        req.flash('success', 'Berhasil login');
        res.redirect('/users');
      } else {
        req.flash('error', 'password salah');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'email tidak ditemukan');
      res.redirect('/login');
    }
  } catch (error) {
    req.flash('error', 'terjadi kesalahan pada server');
    res.redirect('/login');
  }
});

// --- DAFTARKAN RUTE WHATSAPP KE ROUTER UTAMA ---
router.use('/api', whatsappRoutes);
// ----------------------------------------------

module.exports = router;