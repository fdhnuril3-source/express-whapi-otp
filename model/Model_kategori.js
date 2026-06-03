const connection = require("../config/database");

class Model_kategori {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('select * from kategori order by id_kategori desc', (err, rows) =>{
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
            connection.query('insert into kategori set ?',Data,function (err, rows){
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
            connection.query('select * from kategori where id_kategori =' + id, (err, rows)=>{
            if (err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
        })
    }

    static async update(id, Data){
        return new Promise((resolve, reject) => {
            connection.query('update kategori set ? where id_kategori = ' + id, Data, function (err, result){
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
            connection.query('delete from kategori where id_kategori =' + id, function(err, result){
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
        })
    }

}

module.exports = Model_kategori;