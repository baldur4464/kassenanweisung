import connection, { asyncQuery } from './db.js'

/**
 * 
 * @returns {{Id: number, Name: string}} rows The rows of Inhabers
 */
export async function getAllInhaber() {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : "Kassenanweisung"
  let sql = "SELECT * FROM " + dbName + ".Inhaber";
  let rows = await asyncQuery(sql);
  return rows;
}