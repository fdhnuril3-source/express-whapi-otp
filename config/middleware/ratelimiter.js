const ratelimit = require('express-rate-limit');

const loginLimiter = ratelimit({
    windowMs: 7 * 60 * 1000, // Waktu 7 menit
    max: 3,                  // Batas maksimal 3 kali percobaan per IP
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 7 menit.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = loginLimiter;