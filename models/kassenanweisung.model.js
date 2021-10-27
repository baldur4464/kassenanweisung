import connection from "./db.js"

function getAllKassenanweisung (res) {

    connection.query(("SELECT * FROM mysql.Kassenanweisungen"), (err, rows) => {
        res.render('kaweanzeigen', {rows});
    });
}

function insertKassenanweisung (body) {

    console.log(body);
    connection.query(("INSERT INTO mysql.Kassenanweisungen SET ?"),body, (err, res) => {
        if (err) console.log("Fehler beim Einlesen");
        console.log(res);
    })
}

export {getAllKassenanweisung, insertKassenanweisung}


