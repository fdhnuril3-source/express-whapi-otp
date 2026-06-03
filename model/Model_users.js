const connection = require("../config/database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Model_users {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query(
                'select * from users order by id_users desc',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    static async Store(data){
        return new Promise((resolve, reject) => {
            connection.query(
                'insert into users set ?',
                data,
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query(
                'select * from users where id_users = ?',
                [id],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    static async update(id, data){
        return new Promise((resolve, reject) => {
            connection.query(
                'update users set ? where id_users = ?',
                [data, id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static async delete(id){
        return new Promise((resolve, reject) => {
            connection.query(
                'delete from users where id_users = ?',
                [id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static async getByEmail(email){
        return new Promise((resolve, reject) => {
            connection.query(
                'select * from users where email = ?',
                [email],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows[0]);
                }
            );
        });
    }

    static async registerUser(email, password){
        return new Promise(async (resolve, reject) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                connection.query(
                    'insert into users (email, password) values (?, ?)',
                    [email, hashedPassword],
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    static async login(email, password){
        return new Promise((resolve, reject) => {

            const sql = 'select * from users where email = ?';

            connection.query(sql, [email], async (err, result) => {

                if (err) return reject({ status: 500, message: 'error pada server' });

                if (result.length === 0) {
                    return reject({ status: 401, message: 'email tidak ditemukan' });
                }

                const user = result[0];

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return reject({ status: 401, message: 'password salah' });
                }

                const token = jwt.sign(
                    {
                        id: user.id_users,
                        email: user.email
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                resolve({ token, user });
            });
        });
    }

}

module.exports = Model_users;