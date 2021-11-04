import connection from "./db.js"

function viewAllKaWe (req, res) {

    connection.query(("SELECT * FROM mysql.Kassenanweisungen"), (err, rows) => {
        res.render('kaweanzeigen', {rows});
    });
}

function viewEditKaWe (req, res) {

    connection.query('SELECT * FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?',[req.params.id], (err, rows) => {
        res.render('kaweedit', {rows});
    })
}

function insertKaWe (req, res) {

    let body = req.body;

    connection.query(("INSERT INTO mysql.Kassenanweisungen SET ?"),body, (err, res) => {
        if (err) console.log("Fehler beim Einlesen");

    })
}

function deleteKaWe (req, res) {
    connection.query(('DELETE FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?'),[req.params.id], (err) => {
        if (err) console.log(err);
    } )

    connection.query(("SELECT * FROM mysql.Kassenanweisungen"), (err, rows) => {
        let removed = true;
        res.render('kaweanzeigen', {removed, rows})
    });
}

function updateKaWe (req, res) {
    let body = req.body;

    connectionquery((""))
}

function viewKaWe (req, res) {
    connection.query('SELECT * FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?',[req.params.id], (err, rows) => {
        res.render('kaweview', {rows});
    })
}

export {viewAllKaWe, viewEditKaWe, insertKaWe, deleteKaWe, updateKaWe, viewKaWe};



