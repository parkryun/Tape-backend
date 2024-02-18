const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    database: 'Tape',
    user: 'root',
    password: 'qkrfbs12!',
});

module.exports = pool; 
 