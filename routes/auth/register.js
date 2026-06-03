var express = require('express');
const Model_users = require('../../model/Model_users');
var router = express.Router();

router.post('/',async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    try {
        const existingUser = await Model_users.getByEmail(email);
        if (existingUser){
            return res.status(400).json({ message: 'Email sudah digunakan' });
        }
        await Model_users.registerUser(email, password);
        res.status(201).json({ message: 'registrasi berhasil' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error});
    }
})
module.exports = router;

