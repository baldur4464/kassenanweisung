import connection from "./db.js"

function viewAllKaWe (req, res) {
    const page = req.query.page;
    const updated = req.query.edit;
    const removed = req.query.removed;
    const limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    connection.query(("SELECT * FROM mysql.Kassenanweisungen  ORDER BY Kassenanweisung_ID DESC"), (err, rows) => {
        let firstpage;
        let lastpage;
        let entries;

        entries = rows.length;
        let maxpage = Math.ceil(entries / limit);

        rows = rows.slice(startIndex, endIndex);


        firstpage = page == 1;

        lastpage = page == maxpage;

        res.render('kaweanzeigen', {rows, page, firstpage, lastpage, updated, removed});
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
        [Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum], (err) => {
        if (err) console.log(err);

        res.redirect('/');

    })
}

function deleteKaWe (req, res) {
    connection.query(('DELETE FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?'),[req.params.id], (err) => {
        if (err) console.log(err);
    } )
        res.redirect('/kaweanzeigen?page=1&removed=true')
}

function updateKaWe (req, res) {
    const {Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum} = req.body;
    connection.query(("UPDATE mysql.Kassenanweisungen SET Haushaltsjahr = ?, Titelnr = ?, Geldgeber = ?, Begründung = ?, Betrag = ?, Geldempfänger = ?, Zahlungsart = ?, Beleg = ?, Ausstellungsdatum = ?, Zahlungsdatum = ? WHERE Kassenanweisung_ID = ?")
    ,[Haushaltsjahr, Titelnr, Geldgeber, Begründung, Betrag, Geldempfänger, Zahlungsart, Beleg, Ausstellungsdatum, Zahlungsdatum, req.params.id], (err) => {
        if(err) {
            console.log(err);
            return;
        }

            res.redirect('/kaweanzeigen?page=1&edit=true');
        })
}

function viewKaWe (req, res) {
    connection.query('SELECT * FROM mysql.Kassenanweisungen WHERE Kassenanweisung_ID = ?',[req.params.id], (err, rows) => {
        res.render('kaweview', {rows});
    })
}

export {viewAllKaWe, viewEditKaWe, insertKaWe, deleteKaWe, updateKaWe, viewKaWe};



