const mysql = require('mysql2/promise');
require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.HOST,
//     database: process.env.DATABASE,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
// });
const pool = mysql.createPool({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    port: process.env.PORT || 3306,
    password: process.env.PASSWORD || "092329",
    database: process.env.TABLE || "tape",
});


module.exports = pool;
