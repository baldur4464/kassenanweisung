import express from "express";
import * as model from "../models/kassenanweisung.model.js"

const router = express.Router();

router.get('/', (req, res) => {
    res.render('kassenanweisung')
});

router.post('/', (req, res) => {
    model.insertKaWe(req, res);
})

router.get('/kaweanzeigen', (req, res) => {
    model.viewAllKaWe(req, res);
})

router.get('/:id', (req, res) => {
    model.deleteKaWe(req, res);
})




export {router};