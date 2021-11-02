import connection from "./db.js"

function viewAllKaWe (req, res) {

    connection.query(("SELECT * FROM mysql.Kassenanweisungen"), (err, rows) => {
        res.render('kaweanzeigen', {rows});
    });
}

function insertKaWe (req, res) {

    let body = req.body;

    connection.query(("INSERT INTO mysql.Kassenanweisungen SET ?"),body, (err, res) => {
        if (err) console.log("Fehler beim Einlesen");

    })
}

function deleteKaWe (req, res) {
    console.log(req.body)
    let removed = true;
    let rows;

    connection.query(('DELETE FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?'),[req.params.id], (err) => {
        if (err) console.log(err);
    } )

    connection.query(("SELECT * FROM mysql.Kassenanweisungen"), (err, rows) => {
        res.render('kaweanzeigen', {removed, rows})
    });
}

export {viewAllKaWe, insertKaWe, deleteKaWe};



