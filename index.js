import express from "express";
import exphbs from "express-handlebars";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import * as KaWeModel from "./models/kassenanweisung.model.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.use(express.static(path.join(__dirname,'public')));
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

app.post('/',(req, res) => {
    KaWeModel.insertKassenanweisung(req.body);
});

app.listen(port, () => {
    console.log(`The web server has started on port ${port}`);
})