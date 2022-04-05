import express from 'express'
import { createGeldanlageForInhaber, getGeldanlagenForInhaber } from '../models/geldanlage.model.js';
import { createInhaber } from '../models/inhaber.model.js';

const inhRouter = express.Router()

inhRouter.get('/:inhaber/geldanlagen', async(req, res) => {
  let geldanlagen = await getGeldanlagenForInhaber(req.params.inhaber)
  let geldanlage_Arr = []
  geldanlagen.map(({ Id, Name, Inhaber, Konto }) => {
    geldanlage_Arr.push({ Name, Id, Konto })
  })
  res.json(geldanlage_Arr)
});

inhRouter.post("/", async(req, res) => {

  const { Name } = req.body;

  let result = await createInhaber({ Name });
  if (result === undefined) {
    res.sendStatus(400);
    return
  }
  res.sendStatus(200);
})

inhRouter.post('/:inhaber/geldanlagen', async(req, res) => {
  const { Name } = req.body
  console.log("Soll neue Geldanlage " + Name + " erstellen.");

  let result = createGeldanlageForInhaber({ Name: Name, Inhaber: req.params.inhaber })
  if (result === undefined) {
    res.sendStatus(400);
    return;
  }
  console.log("Result: " + JSON.stringify(result))
  res.sendStatus(200);
})


export { inhRouter };