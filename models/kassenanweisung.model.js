import connection from "./db.js"

function viewAllKaWe (req, res) {
    const page = req.query.page;
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    connection.query(("SELECT * FROM mysql.Kassenanweisungen ORDER BY Kassenanweisung_ID DESC"), (err, rows) => {
        var firstpage;
        var lastpage;
        var entries;

        entries = rows.length;
        var maxpage = Math.ceil(entries / limit);

        rows = rows.slice(startIndex, endIndex);


        if(page == 1) {
            firstpage = true;
        } else {
            firstpage = false;
        }

        if(page == maxpage) {
            lastpage = true;
        } else {
            lastpage = false;
        }

        res.render('kaweanzeigen', {rows, page, firstpage, lastpage});
    });
}

function viewEditKaWe (req, res) {

    connection.query('SELECT * FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?',[req.params.id], (err, rows) => {
        res.render('kaweedit', {rows});
    })
}

function insertKaWe (req, res) {

    const {Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum} = req.body;
    connection.query(("INSERT INTO mysql.Kassenanweisungen SET Haushaltsjahr = ?, Titelnr = ?, Geldgeber = ?, Begründung = ?, Betrag = ?, Geldempfänger = ?, Zahlungsart = ?, Beleg = ?, Ausstellungsdatum = ?, Zahlungsdatum = ?"),
        [Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum], (err, res) => {
        if (err) console.log(err);


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

    console.log(body)
    const {Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum} = req.body;
    connection.query(("UPDATE mysql.Kassenanweisungen SET Haushaltsjahr = ?, Titelnr = ?, Geldgeber = ?, Begründung = ?, Betrag = ?, Geldempfänger = ?, Zahlungsart = ?, Beleg = ?, Ausstellungsdatum = ?, Zahlungsdatum = ? WHERE Kassenanweisung_ID = ?")
    , [Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum, req.params.id], (err, rows) => {
        console.log(Zahlungsart)
        if(err) {
            console.log(err);
            return;
        }


        connection.query(("SELECT * FROM mysql.Kassenanweisungen"), (err, rows) => {
            var updated = true
            res.render('kaweanzeigen', {updated, rows});
        });
        })
}

function viewKaWe (req, res) {
    connection.query('SELECT * FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?',[req.params.id], (err, rows) => {
        res.render('kaweview', {rows});
    })
}

export {viewAllKaWe, viewEditKaWe, insertKaWe, deleteKaWe, updateKaWe, viewKaWe};



