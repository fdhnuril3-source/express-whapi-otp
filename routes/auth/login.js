var express = require('express');
var router = express.Router();
const loginLimiter = require('../../config/middleware/ratelimiter');

// Menerapkan rate limiter dan method POST
router.post('/', loginLimiter, async function(req, res, next) {
    try {
        return res.status(200).json({
            status: true,
            message: 'Login berhasil'
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = router;