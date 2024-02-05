const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
});

module.exports = db;
