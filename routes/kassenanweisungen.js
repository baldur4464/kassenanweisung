import express from "express";
import { GetKassenanweisungPDF as GetKassenanweisungPDF } from "../backend/endpoints.js";
import * as model from "../models/kassenanweisung.model.js";
import * as pdfservice from "../services/KassenanweisungPDF.js";
import {Blob} from "buffer"

const router = express.Router();

router.post('/', (req, res) => {
  model.insertKaWe(req, res);
})

router.get('/', (req, res) => {
  model.viewAllKaWe(req, res);
})

router.get('/delete/:id', (req, res) => {
  model.deleteKaWe(req, res);
})

router.get('/edit/:id', (req, res) => {
  model.viewEditKaWe(req, res);
})

router.post('/edit/:id', (req, res) => {
  model.updateKaWe(req, res);
})

router.get('/view/:id', (req, res) => {
  model.viewKaWe(req, res);
})

router.get('/download', (req, res) => {
  pdfservice.kassenanweisungdownload(req, res);
})

router.get('/pdf/:id', async (req, res) => {
  let buffer = await GetKassenanweisungPDF(req.params.id)
  console.log("Setting type to "+buffer.type)
  res.type(buffer.type)
  res.send(await buffer.text())
})

router.get('*', (req, res) => {
  res.render('404');
})


export { router };