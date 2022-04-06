import connection, { asyncQuery } from './db.js'

/**
 * 
 * @returns { {Id: number, Name: string} }
 */
export async function getAllInhaber() {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : "Kassenanweisung"
  let sql = "SELECT * FROM " + dbName + ".Inhaber";
  let rows = await asyncQuery(sql);
  return rows;
}

/**
 * 
 * @param { {Name: string} } inh 
 * @returns {number}
 */
export async function createInhaber(inh) {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : 'Kassenanweisung';
  let sql = "INSERT INTO " + dbName + '.Inhaber (Name) Values(?)';
  let res = await asyncQuery(sql, inh.Name);
  return res.insertId
}