const connection = require("../config/database");
// Impor fungsi crypto yang sudah ada di folder config/crypto.js
const { encryptData, decryptData } = require("../config/crypto");

class Model_produk {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('select * from produk order by id_produk desc', (err, rows) =>{
                if (err){
                    reject(err);
                } else {
                    // Dekripsi data pada setiap baris produk sebelum dikembalikan
                    const decryptedRows = rows.map(row => ({
                        ...row,
                        // Sesuaikan kolom mana yang dienkripsi di database, contoh: nama_produk
                        nama_produk: row.nama_produk ? decryptData(row.nama_produk) : row.nama_produk
                    }));
                    resolve(decryptedRows);
                }
            })
        })
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            // Enkripsi data sensitif (misalnya nama_produk) sebelum disimpan (POST / Langkah 1 & 2)
            const dataToStore = {
                ...Data,
                nama_produk: Data.nama_produk ? encryptData(Data.nama_produk) : Data.nama_produk
            };

            connection.query('insert into produk set ?', dataToStore, function (err, rows){
                if (err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('select * from produk where id_produk = ?', [id], (err, rows)=>{
                if (err) {
                    reject(err);
                } else {
                    // Dekripsi data saat diambil berdasarkan ID
                    const decryptedRows = rows.map(row => ({
                        ...row,
                        nama_produk: row.nama_produk ? decryptData(row.nama_produk) : row.nama_produk
                    }));
                    resolve(decryptedRows);
                }
            })
        })
    }

    static async update(id, Data){
        return new Promise((resolve, reject) => {
            // Enkripsi juga saat melakukan update data
            const dataToUpdate = {
                ...Data,
                nama_produk: Data.nama_produk ? encryptData(Data.nama_produk) : Data.nama_produk
            };

            connection.query('update produk set ? where id_produk = ' + id, dataToUpdate, function (err, result){
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    static async delete(id){
        return new Promise((resolve, reject) => {
            connection.query('delete from produk where id_produk =' + id, function(err, result){
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

}

module.exports = Model_produk;