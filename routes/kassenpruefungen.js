import express from "express";
import { getHaushaltsjahre } from "../models/kassenanweisung.model.js";
import { getGeldanlagenForInhaber } from "../models/geldanlage.model.js";
import { GetKassenpruefungen, GetKassenpruefung, UpdateKassenpruefung, CreateKassenpruefung, DeleteKassenpruefung } from "../backend/endpoints.js";
import { format } from "date-fns";

const kpRouter = express.Router();

kpRouter.get("/", async(req, res) => {
  let kps = await GetKassenpruefungen();
  let page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10
  const updated = req.query.edit ? req.query.edit : false
  const removed = req.query.removed ? req.query.removed : false
  const created = req.query.created ? req.query.created : false
  let firstpage = page == 1

  if (kps === undefined) {
    res.render("404.hbs")
    return
  }
  let lastpage = page == Math.ceil(kps.length / limit);
  const hhj_arr = await getHaushaltsjahre()
  res.render("kaprueanzeigen", { rows: kps, page: page, firstpage: firstpage, lastpage: lastpage, updated: updated, removed: removed, created: created, HEADER_HHJ: hhj_arr,});
});

kpRouter.get("/edit/:id", async(req, res) => {
  let kp = await GetKassenpruefung(req.params.id);
  const hhj_arr = await getHaushaltsjahre()
  res.render("kaprueedit", {Id: kp.Id, Datum: kp.Datum, Geldanlage: kp.Geldanlagename, Betrag: kp.Betrag, PrevPage: req.query.prevPage, HEADER_HHJ: hhj_arr });
})

kpRouter.put("/edit/:id", async(req, res) => {
  const kp = {
    Id,
    Datum,
    Betrag,
    Geldanlagename: Geldanlage,
  } = req.body
  const code = await UpdateKassenpruefung(kp)
  const hhj_arr = await getHaushaltsjahre()
  if (code === 200) {
    res.redirect('/kassenpruefungen?page=' + req.query.prevPage + '&edit=true')
  } else {
    const geldanlagen = await getGeldanlagenForInhaber("Fachschaft ET");
    res.render("kaprueedit", {Id: kp.Id, Geldanlagen: geldanlagen.map((e) => e.Name), Geldanlage: kp.Geldanlagename, Datum: kp.Datum, Betrag: kp.Betrag, error: true, HEADER_HHJ: hhj_arr });
  }
})

kpRouter.get("/create", async (req, res) => {
  const geldanlagen = await getGeldanlagenForInhaber("Fachschaft ET");
  res.render("kaprue", {Datum: format(Date.now(), "dd.MM.yyyy"), Geldanlagen: geldanlagen.map((e) => {
    return {Name: e.Name, Id: e.Id};
  }),});
})

kpRouter.post("/create", async (req, res) => {
  const kp = {
    Datum,
    Betrag,
    GeldanlageId: Geldanlage,
  } = req.body
  const code = await CreateKassenpruefung({...kp, GeldanlageId: parseInt(kp.GeldanlageId)});
  if (code === 200) {
    res.redirect('/kassenpruefungen?created=true')
  }
})

kpRouter.get("/delete", async (req, res) => {
  const prevPage = req.query.prevPage ? req.query.prevPage : 1;
  const code = await DeleteKassenpruefung(1);
  res.render("404");
})

export { kpRouter };