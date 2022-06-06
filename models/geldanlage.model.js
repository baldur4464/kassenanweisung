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
 * @returns {Promise<{Id: number, Name: string, Inhaber: string, Konto: boolean,}[]>} all Geldanlagen for this Inhaber with their Name, Ids and other Information.
 */
export async function getGeldanlagenForInhaber(inhaberName) {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : 'Kassenanweisung';
  let sql = 'SELECT g.Id AS Id, i.Name AS Inhaber, g.Name as Name, g.Konto AS Konto FROM ' + dbName + '.Geldanlagen g LEFT JOIN ' + dbName + '.Inhaber i ON i.Id = g.InhaberId WHERE i.Name = ?';
  let rows = await asyncQuery(sql, inhaberName);
  return rows;
}

/**
 *
 * @param { {Name: string, Inhaber: string} } geldanlage
 * @returns {number} insertId Returns the Id of the newly inserted object.
 */
export async function createGeldanlageForInhaber(geldanlage) {
  let dbName = process.env.DB_NAME ? process.env.DB_NAME : 'Kassenanweisung';
  let rows = await asyncQuery("SELECT Id FROM " + dbName + ".Inhaber WHERE Name = ?", geldanlage.Inhaber);
  console.log("Getting rows for Inhaber: " + JSON.stringify(rows));
  let sql = 'INSERT INTO ' + dbName + '.Geldanlagen (Name, InhaberId, Konto) VALUES(?, ?, ?)';
  let res = await asyncQuery(sql, [geldanlage.Name, rows[0].Id, false]);
  console.log("Inserting: " + JSON.stringify(res));
  return res.insertId;
}