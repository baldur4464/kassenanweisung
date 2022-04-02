import connection, { asyncQuery } from './db.js'


async function addUser (username, hashedPassword) {
  let sql =
    "INSERT INTO" +
    procress.env.DB_NAME +
    ".user SET username = ?, password = ?"

  connection.query(sql, [username, hashedPassword])
}

export {

}