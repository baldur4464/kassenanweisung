import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

connection.connect();

/**
 * 
 * @param {string} sql 
 * @param {any} args 
 * @returns {Promise<any>}
 */
export function asyncQuery(sql, args) {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    })
  })
}

export default connection;