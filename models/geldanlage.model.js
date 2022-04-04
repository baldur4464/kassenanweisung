import connection, { asyncQuery } from './db.js'

/**
 *
 * @returns {{Id: number, Name: string}} rows The rows of Inhabers
 */
export async function getAllGeldanlagen() {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : 'Kassenanweisung'
  let sql = 'SELECT * FROM ' + dbName + '.Geldanlage'
  let rows = await asyncQuery(sql)
  return rows
}

/**
 * 
 * @param {string} inhaberName 
 * @returns {{Id: number, Name: string, Inhaber: string}}
 */
export async function getGeldanlagenForInhaber(inhaberName) {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : 'Kassenanweisung';
  let sql = 'SELECT g.Id AS Id, i.Name AS Inhaber, g.Name as Name FROM ' + dbName + '.Geldanlagen g LEFT JOIN ' + dbName + '.Inhaber i ON i.Id = g.InhaberId WHERE i.Name = ?';
  let rows = await asyncQuery(sql, inhaberName);
  return rows;
}