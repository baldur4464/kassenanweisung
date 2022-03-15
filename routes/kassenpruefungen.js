import express from "express";
import { GetKassenpruefungen } from "../backend/endpoints.js";

const kpRouter = express.Router();

kpRouter.get("/", async(req, res) => {
  let kps = await GetKassenpruefungen();
  let page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10
  const updated = req.query.edit ? req.query.edit : false
  const removed = req.query.removed ? req.query.removed : false
  let firstpage = page == 1

  if (kps === undefined) {
    res.render("404.hbs")
    return
  }
  let lastpage = page == Math.ceil(kps.length / limit);
  res.render("kaprueanzeigen", { rows: kps, page: page, firstpage: firstpage, lastpage: lastpage, updated: updated, removed: removed, });
});

export { kpRouter };