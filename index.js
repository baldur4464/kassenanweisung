import express from "express";
import exphbs from "express-handlebars";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import { router } from "./routes/kassenanweisungen.js";
import helpers from './public/js/helpers.js';
import { kpRouter } from "./routes/kassenpruefungen.js";
import { getAllInhaber } from "./models/inhaber.model.js";
import { getGeldanlagenForInhaber } from "./models/geldanlage.model.js";
import { inhRouter } from "./routes/inhaber.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = url.fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: helpers
}));
app.use("/public/autocomplete", express.static(path.join(__dirname, "node_modules/@tarekraafat/autocomplete.js/dist")));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.get('/', async(req, res) => {
  let inhaber_model = await getAllInhaber()
  let inhaber_Arr = []
  inhaber_model.map(({ Id, Name }) => {
    inhaber_Arr.push(Name)
  });

  res.render('kassenanweisung', { Haushaltsjahr: "19/20", Titlenr: "1", Inhaber: JSON.stringify(inhaber_Arr) })
});

app.use("/inhaber", inhRouter);
app.use('/kassenanweisungen', router);
app.use("/kassenpruefungen", kpRouter);


app.listen(port, () => {
  console.log(`The web server has started on port ${port}`);
})