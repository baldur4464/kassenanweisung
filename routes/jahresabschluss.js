import express from "express";
import { getHaushaltsjahre } from "../models/kassenanweisung.model";

const router = express.Router();

router.get("/", async (req, res) => {
    const hhj_arr = await getHaushaltsjahre()
    // Alle Geldanlagen für dieses Haushaltsjahr zeigen, die zur Fachschaft gehören. 
    // Ist im Grunde nur eine kleine Liste mit Name, Anfangs- und Endbetrag, sowie einem Knopf zum Download der PDF oder ZIP Datei.

})

router.get("/:hhj/:anlageId/pdf", async (req, res) => {
    //PDF für das genannte Haushaltsjahr und die AnlageId zeigen
    
})

router.get("/:hhj/:anlageId/zip", async (req, res) => {
    //ZIP für das genannte Haushaltsjahr und die AnlageId zeigen
})

export {router};