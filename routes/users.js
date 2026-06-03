var express = require('express');
var router = express.Router();
const Model_users = require('../model/Model_users');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let userId = req.session.userId;
  if (!userId) {
    req.flash('error','Session berakhir');
    return res.redirect('/login');
  }

  try {
    let Data = await Model_users.getId(userId);
    if (Data.length > 0){
      res.render('users/index', {
        email: Data[0].email
      });
    } else {
      req.flash('error','Session berakhir');
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/changepwd', async function(req, res, next) {
  let id = req.session.userId;
  let Data = await Model_users.getId(id);
  res.render('users/changepwd', {
    email: Data[0].email
  });
});

router.post('/update', async function(req, res, next) {
  try {
    let id = req.session.userId;
    let { password } = req.body;
    let enkripsi = await bcrypt.hash(password, 10);
    let Data = {
      password: enkripsi
    }
    await Model_users.update(id, Data);
    req.flash('success', 'Berhasil memperbarui password');
    res.redirect('/users');
  }catch (error){
    req.flash('error', 'Terjadi kesalahan');
    res.redirect('/users');
  };
  });
module.exports = router;
