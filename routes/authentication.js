import express from "express";
import * as auth from "../services/authentication.js"

const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
  res.render('login')
})

authRouter.post('/login', (req, res) => {
  auth.checkLogin(req, res);

})

authRouter.get('/register', (req, res) => {
  res.render('register')
})

authRouter.post('/register', (req, res) => {
  auth.registerUser(req, res)
})

export {authRouter}