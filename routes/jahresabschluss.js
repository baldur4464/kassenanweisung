import express from "express";
import { get } from "express/lib/response";
import { GetJahresabschlussJSON } from "../backend/endpoints";
import { GetGeldanlagenForInhaber, getHaushaltsjahre } from "../models/kassenanweisung.model";

const router = express.Router();

router.get("/", async (req, res) => {
    const hhj_arr = await getHaushaltsjahre()
    // Wir nehmen das neueste Haushaltsjahr
    const hhj = hhj_arr[0]
    // Alle Geldanlagen für dieses Haushaltsjahr zeigen, die zur Fachschaft gehören. 
    // Ist im Grunde nur eine kleine Liste mit Name, Anfangs- und Endbetrag, sowie einem Knopf zum Download der PDF oder ZIP Datei.
    const Link_base="/jahresabschluss/"+encodeURIComponent(hhj)+"/"

    // Geldanlagen für den Benutzer holen
    let geldanlagen = await GetGeldanlagenForInhaber()
    
    //Für jede der Geldanlagen soll der Jahresabschluss als JSON aus dem Backend geholt werden.
    let jahresabschluss = geldanlagen.map((el) => {
        return await GetJahresabschlussJSON(el.Id, hhj)
    })

    let data = jahresabschluss.map((val) => {
        return { 
            Name: val.Geldanlage.Name, 
            Id: val.Geldanlage.Id, 
            Anfangsbetrag: val.Anfangsbetrag, 
            Endbetrag: val.Endbetrag, 
            PDF_Link: Link_base+encodeURIComponent(val.Geldanlage.Id)+"/pdf", 
            ZIP_Link: Link_base+encodeURIComponent(val.Geldanlage.Id)+"/zip", 
            ZIP_Name: val.Geldanlage.Name+"-"+val.Haushaltsjahr.replace("/", "_"), 
        }
    })

    res.render("jahresabschluss", data);
    
})

router.get("/:hhj/:anlageId/pdf", async (req, res) => {
    //PDF für das genannte Haushaltsjahr und die AnlageId zeigen
    
    console.log("request came in");
})

router.get("/:hhj/:anlageId/zip", async (req, res) => {
    //ZIP für das genannte Haushaltsjahr und die AnlageId
    console.log("request came in");
})

export {router};