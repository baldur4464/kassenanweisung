import connection, { asyncQuery } from './db.js'

/**
 * 
 * @returns {Promise<{Kassenanweisung: string}[]>}
 */
async function getHaushaltsjahre() {
  const query = "SELECT Haushaltsjahr FROM " + process.env.DB_NAME + ".Kassenanweisungen GROUP BY Haushaltsjahr ORDER BY Haushaltsjahr DESC"
  let rows = await asyncQuery(query)
  return rows
}

//Modelle für Views
function viewAllKaWe(req, res) {
  const page = req.query.page ? req.query.page : 1
  const updated = req.query.edit ? req.query.edit : false
  const removed = req.query.removed ? req.query.removed : false
  const limit = req.query.limit ? req.query.limit : 10
  const filter = req.query.filter ? req.query.filter : null
  let maxEntries
  let haushaltsjahre
  let sql
  const startIndex = (page - 1) * limit


  if (filter != null) {
    sql =
      'SELECT COUNT(*) AS count FROM ' +
      process.env.DB_NAME +
      '.Kassenanweisungen WHERE Haushaltsjahr =' +
      "'" + filter + "'"
  } else {
    sql =
      'SELECT COUNT(*) AS count FROM ' +
      process.env.DB_NAME +
      '.Kassenanweisungen'
  }

  connection.query(sql, (err, rows) => {
    if (err) {
      console.log('Error: ' + err + '\n Rows: ' + rows)
      maxEntries = 0
    } else {
      maxEntries = rows[0].count
    }
  })

  sql =
    'SELECT DISTINCT Haushaltsjahr FROM ' +
    process.env.DB_NAME +
    '.Kassenanweisungen';

  connection.query(sql, (err, result) => {
    if (err) console.log(err)
    haushaltsjahre = result;
  })

  if (filter != null) {
    sql =
      'SELECT * FROM ' +
      process.env.DB_NAME +
      '.Kassenanweisungen WHERE Haushaltsjahr=' +
      "'" + filter + "'" +
      ' ORDER BY Id DESC LIMIT ' +
      startIndex +
      ',' +
      limit
  } else {
    sql =
      'SELECT * FROM ' +
      process.env.DB_NAME +
      '.Kassenanweisungen ORDER BY Id DESC LIMIT ' +
      startIndex +
      ',' +
      limit
  }

  connection.query(sql, async (err, rows) => {
    if (err) console.log(err);
    let firstpage
    let lastpage

    let maxpage = Math.ceil(maxEntries / limit)
    let hostIPs = req.connection.remoteAddress.split(":")
    let hostIP = hostIPs[hostIPs.length - 1]

    //Booleans zum Prüfen, ob sich die AKtuelle Page auf der ersten oder letzten Page befindet.
    firstpage = page == 1
    lastpage = page == maxpage

    const hhj_arr = await getHaushaltsjahre()

    res.render('kaweanzeigen', {
      Header_HHJ: hhj_arr,
      rows: rows,
      page: page,
      firstpage: firstpage,
      lastpage: lastpage,
      updated: updated,
      removed: removed,
      backend_port: process.env.BACKEND_PORT,
      host_ip: hostIP,
      haushaltsjahre: haushaltsjahre,
      maxpage: maxpage,
      filter: filter,
      limit: limit,
    })
  })
}

function viewEditKaWe(req, res) {
  renderKaWeWith(req.params.id, 'kaweedit', res, { PrevPage: req.query.prevPage, PrevFilter: req.query.prevFilter, PrevLimit: req.query.prevLimit })
}

async function insertKaWe(req, res) {
  let {
    Haushaltsjahr,
    Titelnr,
    Geldgeber,
    Geldanlage_Geldgeber,
    Begruendung,
    Betrag,
    Geldempfaenger,
    Geldanlage_Geldempfaenger,
    Zahlungsart,
    Beleg,
    Ausstellungsdatum,
    Zahlungsdatum,
  } = req.body

  let rawTitlenr = await neueTitelnr(req.body.Haushaltsjahr)
  console.log(rawTitlenr);
  let GeldgeberIds = await createInhaberAndGeldanlageIfNotExists(Geldgeber, Geldanlage_Geldgeber)

  let GeldempfaengerIds = await createInhaberAndGeldanlageIfNotExists(Geldempfaenger, Geldanlage_Geldempfaenger)

  Titelnr = rawTitlenr[0].maxTitelNr + 1

  console.log(Titelnr)

  let sql =
    'INSERT INTO ' +
    process.env.DB_NAME +
    '.Kassenanweisungen SET Haushaltsjahr = ?, Titelnr = ?, Geldanlage_Geldgeber = ?, Begruendung = ?, Betrag = ?, Geldanlage_Geldempfaenger = ?, Zahlungsart = ?, Beleg = ?, Ausstellungsdatum = ?, Zahlungsdatum = ?'
  connection.query(
    sql, [
      Haushaltsjahr,
      Titelnr,
      GeldgeberIds.GeldanlageId,
      Begruendung,
      Betrag,
      GeldempfaengerIds.GeldanlageId,
      Zahlungsart,
      Beleg,
      Ausstellungsdatum,
      Zahlungsdatum,
    ],
    (err) => {
      if (err) console.log((err))
      res.redirect('?created=true')
    },
  )
}

function deleteKaWe(req, res) {
  console.log(req.query)
  connection.query(
    'DELETE FROM ' + process.env.DB_NAME + '.Kassenanweisungen WHERE Id = ?', [req.params.id],
    (err) => {
      if (err) console.log(err)
    },
  )
  if(req.query.prevFilter != null && req.query.prevFilter != "") {
    res.redirect('/kassenanweisungen?page=' + req.query.prevPage + '&filter=' + req.query.prevFilter + '&limit=' + req.query.prevLimit + '&removed=true')
  } else {
    res.redirect('/kassenanweisungen?page=' + req.query.prevPage + '&limit=' + req.query.prevLimit + '&removed=true')
  }
}

async function updateKaWe(req, res) {
  const {
    Haushaltsjahr,
    Titelnr,
    Geldgeber,
    Geldanlage_Geldgeber,
    Begruendung,
    Betrag,
    Geldempfaenger,
    Geldanlage_Geldempfaenger,
    Zahlungsart,
    Beleg,
    Ausstellungsdatum,
    Zahlungsdatum,
  } = req.body


  let GeldgeberIds = await createInhaberAndGeldanlageIfNotExists(Geldgeber, Geldanlage_Geldgeber)
  let GeldempfaengerIds = await createInhaberAndGeldanlageIfNotExists(Geldempfaenger, Geldanlage_Geldempfaenger)

  connection.query(
    'UPDATE ' + process.env.DB_NAME + '.Kassenanweisungen SET Haushaltsjahr = ?, Titelnr = ?, Geldanlage_Geldgeber = ?, Begruendung = ?, Betrag = ?, Geldanlage_Geldempfaenger = ?, Zahlungsart = ?, Beleg = ?, Ausstellungsdatum = ?, Zahlungsdatum = ? WHERE Id = ?', [
      Haushaltsjahr,
      Titelnr,
      GeldgeberIds.GeldanlageId,
      Begruendung,
      Betrag,
      GeldempfaengerIds.GeldanlageId,
      Zahlungsart,
      Beleg,
      Ausstellungsdatum,
      Zahlungsdatum,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.log(err)
        return
      }

      if (req.query.prevFilter != null && req.query.prevFilter != "") {
        res.redirect('/kassenanweisungen?page=' + req.query.prevPage + '&filter=' + req.query.prevFilter + '&limit=' + req.query.prevLimit + '&edit=true')
      } else {
        res.redirect('/kassenanweisungen?page=' + req.query.prevPage + '&limit=' + req.query.prevLimit+ '&edit=true')
      }
    }
  )
}

function viewKaWe(req, res) {
  renderKaWeWith(req.params.id, 'kaweview', res, { PrevPage: req.query.prevPage, PrevFilter: req.query.prevFilter, PrevLimit: req.query.prevLimit})
}

async function createInhaberAndGeldanlageIfNotExists(inhaberName, geldanlageName) {
  let inhaberId, geldanlageId

  // Check if Inhaber exists and add him if not
  const rows = await asyncQuery("SELECT Id FROM " + process.env.DB_NAME + ".Inhaber WHERE Name = ?", [inhaberName]).catch(err => { throw err })
  if (rows.length === 0) {
    const result = await asyncQuery("INSERT INTO " + process.env.DB_NAME + ".Inhaber SET Name=?", [inhaberName]).catch(err => { throw err })
    inhaberId = result.insertId;
  } else {
    inhaberId = rows[0].Id
  }
  // Check if Geldanlage exists and insert if not
  const rows2 = await asyncQuery("SELECT Id FROM " + process.env.DB_NAME + ".Geldanlagen WHERE Name = ? AND InhaberId = ?", [geldanlageName, inhaberId]).catch(err => { throw err })
  if (rows2.length === 0) {
    const result2 = await asyncQuery("INSERT INTO " + process.env.DB_NAME + ".Geldanlagen SET Name=?, Konto=?, InhaberId = ? ", [geldanlageName, false, inhaberId]).catch(err => { throw err })
    geldanlageId = result2.insertId
  } else {
    geldanlageId = rows2[0].Id
  }

  return { InhaberId: inhaberId, GeldanlageId: geldanlageId }
}

async function neueTitelnr (Haushaltsjahr) {
  let rows = await asyncQuery('SELECT MAX(Titelnr) AS maxTitelNr FROM ' + process.env.DB_NAME + '.Kassenanweisungen WHERE Haushaltsjahr=?', [Haushaltsjahr]).catch(err => {throw err})
  return rows;
}

/**
 * 
 * @returns {Promise<{Id: string, Name: string}[]>}
 */
async function GetGeldanlagenForInhaber() {
  const SQL = "SELECT g.Id, g.Name FROM "+process.env.DB_NAME+".Geldanlagen g LEFT JOIN "+process.env.DB_NAME+".Inhaber i ON g.InhaberId = i.Id WHERE i.Name = \"Fachschaft ET\""
  let rows = await asyncQuery(SQL)
  return rows
}

function renderKaWeWith(id, renderFile, res, extraFields) {
  // Dieser SQL String verbindet die Kassenanweisungstabelle mit den Tabellen Inhaber und Geldanlagen und zeigt statt der ID der Geldanlage den Namen
  let sql =
    `SELECT
	ka.Id,
	ka.Haushaltsjahr,
	ka.Titelnr,
	ka.Betrag,
	ka.Begruendung,
	ka.Zahlungsdatum,
	ka.Ausstellungsdatum,
	ka.Zahlungsart,
	ka.Beleg,
  ka.Geldanlage_Geldgeber,
  ka.Geldanlage_Geldempfaenger,
	Ga1.Name_Geldgeber,
	Ga1.Name_Geldanlage_Geldgeber,
	Ga2.Name_Geldempfaenger,
	Ga2.Name_Geldanlage_Geldempfaenger 
FROM
  ` +
    process.env.DB_NAME +
    `.Kassenanweisungen ka
LEFT JOIN (
	SELECT
		g.Id,
		i.Name AS Name_Geldgeber,
		g.Name AS Name_Geldanlage_Geldgeber
	FROM
    ` +
    process.env.DB_NAME +
    `.Geldanlagen g
	LEFT JOIN ` +
    process.env.DB_NAME +
    `.Inhaber i ON
		i.Id = g.InhaberId ) Ga1 ON
	ka.Geldanlage_Geldgeber = Ga1.Id
LEFT JOIN (
	SELECT
		g.Id,
		i.Name AS Name_Geldempfaenger,
		g.Name AS Name_Geldanlage_Geldempfaenger
	FROM
    ` +
    process.env.DB_NAME +
    `.Geldanlagen g
	LEFT JOIN ` +
    process.env.DB_NAME +
    `.Inhaber i ON
		i.Id = g.InhaberId ) Ga2 ON
	ka.Geldanlage_Geldempfaenger = Ga2.Id
WHERE ka.Id = ?`

  connection.query(sql, [id], async (err, rows) => {
    if (err) console.log(err)
    console.log("Rendering with fields: " + JSON.stringify({ rows, ...extraFields }))
    const Header_HHJ = await getHaushaltsjahre()
    res.render(renderFile, { rows, ...extraFields, Header_HHJ })
  })
}

//Modelle für interne Datenbankabfragen

export {
  GetGeldanlagenForInhaber,
  getHaushaltsjahre,
  viewAllKaWe,
  viewEditKaWe,
  insertKaWe,
  deleteKaWe,
  updateKaWe,
  viewKaWe,
}