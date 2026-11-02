const express = require('express');
const router = express.Router();
const sendWhatsAppWhapi = require('../../config/middleware/sendWhatsAppWhapi');

router.post('/forgot-password', async (req, res) => {
  try {
    const { no_whatsapp } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `Kode OTP Anda adalah: ${otpCode}. Jangan berikan kode ini kepada siapapun.`;

    // Kirim pesan via Whapi helper
    const result = await sendWhatsAppWhapi(no_whatsapp, message);
    
    console.log('Hasil pengiriman Whapi:', result);

    return res.status(200).json({
      status: true,
      message: 'Kode OTP berhasil dikirimkan ke WhatsApp via Whapi.',
      detail: result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Server error' });
  }
});

module.exports = router;