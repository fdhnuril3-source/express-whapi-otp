var express = require('express');
const Model_users = require('../../model/Model_users');
var router = express.Router();

router.post('/',async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    try {
        const result = await Model_users.login(email, password);
        res.status(200).json({ message: 'Login berhasil', data: result });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Terjadi kesalahan'});
        }
})
module.exports = router;

