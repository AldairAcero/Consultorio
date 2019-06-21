const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'consultorio'
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONECTION_LOST') {
            console.error('La conexión con la BD está cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La BD cuenta con muchas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión con la BD fue rechazada');
        }
    }
    if (connection) {
        connection.release();
        console.log('Se ha conectado a la BD');
    }
    return;
});

//De callbacks a promesas
pool.query = promisify(pool.query);

module.exports = pool;