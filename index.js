import express from "express";
import exphbs from "express-handlebars";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import {router} from "./routes/kassenanweisungen.js"
import helpers from "handlebars-helpers";

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



app.use('/', router);



app.listen(port, () => {
    console.log(`The web server has started on port ${port}`);
})