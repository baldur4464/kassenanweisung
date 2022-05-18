import express from "express";
import { GetJahresabschlussJSON, GetJahresabschlussPDF, GetJahresabschlussZIP } from "../backend/endpoints.js";
import { GetGeldanlagenForInhaber, getHaushaltsjahre } from "../models/kassenanweisung.model.js";

const router = express.Router();

router.get("/", (req, res) => {
    renderJahresabschluss(req, res)
})

router.get("/:hhj", (req, res) => {
    renderJahresabschluss(req, res)
})

/**
 * 
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {Response<any, Record<string, any>, number>} res 
 */
async function renderJahresabschluss(req, res) {
    const hhj_arr = await getHaushaltsjahre()
    // Wir nehmen das neueste Haushaltsjahr
    const hhj = req.params.hhj ? req.params.hhj : hhj_arr[0].Haushaltsjahr;
    // Alle Geldanlagen für dieses Haushaltsjahr zeigen, die zur Fachschaft gehören. 
    // Ist im Grunde nur eine kleine Liste mit Name, Anfangs- und Endbetrag, sowie einem Knopf zum Download der PDF oder ZIP Datei.
    const Link_base="/jahresabschluss/"+encodeURIComponent(hhj)+"/"

    // Geldanlagen für den Benutzer holen
    let geldanlagen = await GetGeldanlagenForInhaber()
    
    //Für jede der Geldanlagen soll der Jahresabschluss als JSON aus dem Backend geholt werden.
    let jahresabschluss_promises = geldanlagen.map(async (el) => {
        return GetJahresabschlussJSON(el.Id, hhj)
    })

    let jahresabschluss = await Promise.all(jahresabschluss_promises)

    let data = jahresabschluss.map((val) => {
        return { 
            Name: val.Geldanlage.Name, 
            Id: val.Geldanlage.Id, 
            Anfangsbetrag: val.Anfangsbetrag, 
            Endbetrag: val.Endbetrag, 
            PDF_Link: Link_base+encodeURIComponent(val.Geldanlage.Id)+"/pdf", 
            ZIP_Link: Link_base+encodeURIComponent(val.Geldanlage.Id)+"/zip", 
            ZIP_Name: val.Geldanlage.Name+" "+val.Haushaltsjahr.replace("/", "_")+".zip", 
        }
    })

    res.render("jahresabschluss", { rows: data, hhj: hhj, Header_HHJ: hhj_arr, } );
}

router.get("/:hhj/:anlageId/pdf", async (req, res) => {
    //PDF für das genannte Haushaltsjahr und die AnlageId zeigen
    const pdf_Data = await GetJahresabschlussPDF(req.params.anlageId, req.params.hhj)
    res.type(pdf_Data.type)
    res.send(Buffer.from(await pdf_Data.arrayBuffer()))
})

router.get("/:hhj/:anlageId/zip", async (req, res) => {
    //ZIP für das genannte Haushaltsjahr und die AnlageId
    const pdf_Data = await GetJahresabschlussZIP(req.params.anlageId, req.params.hhj)
    res.type(pdf_Data.type)
    res.send(Buffer.from(await pdf_Data.arrayBuffer()))
})

export {router};