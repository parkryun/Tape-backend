require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// 데이터베이스에 연결
async function query(sql, params) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results, ] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = {
  query
};