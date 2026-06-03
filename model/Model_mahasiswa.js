const connection = require('../config/database');

class model_mahasiswa {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM mahasiswa ORDER BY id_mahasiswa DESC", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getId(id_mahasiswa) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM mahasiswa WHERE id_mahasiswa = ?", [id_mahasiswa], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async checkNrp(nrp, currentId = null) {
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM mahasiswa WHERE nrp = ?";
            let params = [nrp];

            if (currentId) {
                query += " AND id_mahasiswa != ?";
                params.push(currentId);
            }

            connection.query(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async delete(id_mahasiswa) {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM mahasiswa WHERE id_mahasiswa = ?", [id_mahasiswa], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = model_mahasiswa;