const connection = require("../config/database");

class Model_produk {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('select * from produk order by id_produk desc', (err, rows) =>{
            if (err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
        })
    }



    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('insert into produk set ?',Data,function (err, rows){
            if (err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
        })
    }

    static async getId(id){
    return new Promise((resolve, reject) => {
        // Ganti dari +'id' menjadi , [id]
        connection.query('select * from produk where id_produk = ?', [id], (err, rows)=>{
            if (err) reject(err);
            else resolve(rows);
        })
    })
}

    static async update(id, Data){
        return new Promise((resolve, reject) => {
            connection.query('update produk set ? where id_produk = ' + id, Data, function (err, result){
            if (err){
                reject(err);
            }else{
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
            }else{
                resolve(result);
            }
        })
        })
    }

}

module.exports = Model_produk;