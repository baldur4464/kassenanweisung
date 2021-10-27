import connection from "./db.js"

function insertKassenanweisung (body) {

    console.log(body);

    connection.connect();

    connection.query(("INSERT INTO mysql.Kassenanweisungen SET ?"),body, (err, res) => {
        if (err) throw err;
        console.log(res);
    })
    connection.end();


}

export {insertKassenanweisung};