require('dotenv').config();
// note: for node version < 8.x only  !!!!!
// npm install util.promisify
// require('util.promisify').shim();
// -v < 8.x  has problem with async await so upgrade -v to v9.6.1 for this to work. 
// connection pool https://github.com/mysqljs/mysql   [1]
var mysql = require('mysql');
var util = require('util');
var pool = mysql.createPool({
    host: process.env.API_ENDPOINT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});
// ping db for common exception errors 
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (connection)
        connection.release();
    return;
});
// promisify for node async/await.
pool.query = util.promisify(pool.query);
module.exports = pool;
