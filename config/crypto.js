const CryptoJS = require("crypto-js");

const SECRET_KEY = CryptoJS.enc.Utf8.parse("nasipadangdiamakosamadaumapa"); 
const IV = CryptoJS.enc.Utf8.parse("1234567890123456"); 

function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

function decryptData(encryptedData) {
    try {
        if (!encryptedData) return encryptedData;
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) return encryptedData;
        return JSON.parse(decryptedString);
    } catch (error) {
        // Mengembalikan data asli jika gagal didekripsi atau bukan format terenkripsi
        return encryptedData;
    }
}

module.exports = { encryptData, decryptData };