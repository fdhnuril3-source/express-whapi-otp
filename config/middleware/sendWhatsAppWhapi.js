// sendWhatsAppWhapi.js
const sendWhatsAppWhapi = async (to, message) => {
  const apiToken = 'qS7IPBlIOZvDUNNQomye9jqRnos5V9To'; 

  // Format nomor penerima (membersihkan karakter non-angka dan mengubah awalan 0 menjadi 62)
  let formattedNumber = to.replace(/[^0-9]/g, '');
  if (formattedNumber.startsWith('0')) {
    formattedNumber = '62' + formattedNumber.slice(1);
  }

  try {
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: formattedNumber, // Menggunakan nomor bersih tanpa @s.whatsapp.net
        body: message
      })
    });

    const data = await response.json();
    console.log('Response dari Whapi:', data); // Tambahkan log ini untuk melihat detail respon Whapi di terminal
    return data;
  } catch (error) {
    console.error('Gagal mengirim WhatsApp via Whapi:', error);
    return false;
  }
};

module.exports = sendWhatsAppWhapi;