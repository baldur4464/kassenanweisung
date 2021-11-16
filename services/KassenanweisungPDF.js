import express from "express";



function kassenanweisungToPDF (req, res) {
    res.render('kawedownload');
}


export {kassenanweisungToPDF}