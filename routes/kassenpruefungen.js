import express from "express";
import { getHaushaltsjahre } from "../models/kassenanweisung.model.js";
import { getGeldanlagenForInhaber } from "../models/geldanlage.model.js";
import { GetKassenpruefungen, GetKassenpruefung, UpdateKassenpruefung, CreateKassenpruefung, DeleteKassenpruefung } from "../backend/endpoints.js";
import { format, parse } from "date-fns";

const kpRouter = express.Router();

kpRouter.get("/", async(req, res) => {
  let kps = await GetKassenpruefungen();
  let page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10
  const updated = req.query.updated ? req.query.updated : false
  const deleted = req.query.deleted ? req.query.deleted : false
  const delete_error = req.query.delete_error ? req.query.delete_error : false
  const created = req.query.created ? req.query.created : false
  const hhj_arr = await getHaushaltsjahre()
  let firstpage = page == 1

  if (kps === undefined) {
    res.render("404.hbs", {Header_HHJ: hhj_arr,})
    return
  }
  let lastpage = page == Math.ceil(kps.length / limit);
  res.render("kaprueanzeigen", { rows: kps, page: page, firstpage: firstpage, lastpage: lastpage, updated: updated, deleted: deleted, created: created, Header_HHJ: hhj_arr,});
});

kpRouter.get("/edit/:id", async(req, res) => {
  let kp = await GetKassenpruefung(req.params.id);
  const date_parts = kp.Datum.split(".");
  const kp_Datum = date_parts[2]+"-"+date_parts[1]+"-"+date_parts[0];
  const hhj_arr = await getHaushaltsjahre()
  const geldanlagen = await getGeldanlagenForInhaber("Fachschaft ET");
  res.render("kaprueedit", {Id: kp.Id, Datum: kp_Datum, Geldanlage: kp.Geldanlagename, Geldanlagen: geldanlagen.map((e) => {return {Id: e.Id, Name: e.Name}}), Betrag: kp.Betrag, PrevPage: req.query.prevPage, Header_HHJ: hhj_arr });
})

kpRouter.post("/edit/:id", async(req, res) => {
  const {
    date,
    amount,
    geldanlage,
  } = req.body

  const id1 = req.params.id;

  const kp = {Id: parseInt(id1), Datum: format(parse(date, "yyyy-MM-dd", new Date()), "dd.MM.yyyy"), Betrag: parseFloat(amount), GeldanlageId: parseInt(geldanlage)}
  console.log("Got fields: "+JSON.stringify(kp))
  const code = await UpdateKassenpruefung(kp)
  const hhj_arr = await getHaushaltsjahre()
  if (code === 200) {
    res.redirect('/kassenpruefungen?page=' + req.query.prevPage + '&updated=true')
  } else {
    const geldanlagen = await getGeldanlagenForInhaber("Fachschaft ET");
    res.render("kaprueedit", {Id: kp.Id, Geldanlagen: geldanlagen.map((e) => {return {Id: e.Id, Name: e.Name}}), Geldanlage: kp.Geldanlagename, Datum: kp.Datum, Betrag: kp.Betrag, error: true, Header_HHJ: hhj_arr });
  }
})

kpRouter.get("/create", async (req, res) => {
  const geldanlagen = await getGeldanlagenForInhaber("Fachschaft ET");
  const hhj_arr = await getHaushaltsjahre()
  res.render("kaprue", {Datum: format(Date.now(), "yyyy-MM-dd"), Geldanlagen: geldanlagen.map((e) => {
    return {Name: e.Name, Id: e.Id};
  }), HEADER_HHJ: hhj_arr,});
})

kpRouter.post("/create", async (req, res) => {
  const {
    date,
    amount,
    Geldanlage,
  } = req.body;
  const kp = {Datum: parse(date, "yyyy-MM-dd", new Date()), Betrag: amount, GeldanlageId: Geldanlage};
  console.log("Sending "+JSON.stringify({Datum: format(kp.Datum, "dd.MM.yyyy"), Betrag: parseFloat(kp.Betrag), GeldanlageId: parseInt(kp.GeldanlageId)}))
  const code = await CreateKassenpruefung({Datum: format(kp.Datum, "dd.MM.yyyy"), Betrag: parseFloat(kp.Betrag), GeldanlageId: parseInt(kp.GeldanlageId)});
  if (code === 200) {
    res.redirect('/kassenpruefungen?created=true')
  } else {
    const geldanlagen = await getGeldanlagenForInhaber("Fachschaft ET");
    const hhj_arr = await getHaushaltsjahre()
    res.render("kaprue", {Datum: date, Betrag: amount, Geldanlage: Geldanlage, Geldanlagen: geldanlagen.map((e) => {return {Id: e.Id, Name: e.Name}}), error: true, Header_HHJ: hhj_arr,})
  }
})

kpRouter.get("/delete/:id", async (req, res) => {
  const id1 = req.params.id;
  const prevPage = req.query.prevPage ? req.query.prevPage : 1;
  const code = await DeleteKassenpruefung(parseInt(id1));
  if (code === 200) {
    res.redirect('/kassenpruefungen?deleted=true')
  } else {
    res.redirect('/kassenpruefungen?deleted=false')
  }
})

export { kpRouter };