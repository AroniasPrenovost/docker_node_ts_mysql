require('dotenv').config();
var mysql = require('mysql');
var pool = mysql.createPool({
    // host     : 'localhost',
    // user     : 'root',
    // password : 'root',
    // database : 'guess'
    host: process.env.API_ENDPOINT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
var getConnection = function (callback) {
    pool.getConnection(function (err, connection) {
        callback(err, connection);
    });
};
module.exports = getConnection;
exports.pool = pool;
// module.exports = getConnection;
// // var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host: process.env.API_ENDPOINT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });
// connection.connect(function(err) {
//     if (err) throw err;
// });
// module.exports = connection;
