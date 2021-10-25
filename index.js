import express from "express";
import exphbs from "express-handlebars";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('kassenanweisung');
})

app.get('/kaweanzeigen', (req, res) => {
    res.render('kaweanzeigen');
})

app.get('/kawedownload', (req, res) => {
    res.render('kawedownload');
})

console.log(process.env.PORT)

app.listen(port, () => {
    console.log(`The web server has started on port ${port}`);
})