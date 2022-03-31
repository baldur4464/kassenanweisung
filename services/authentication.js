import express from "express";
import dotenv from "dotenv";

function checkLogin (req, res) {
  console.log(req.body.login);
  console.log(req.body.login[0])
  console.log(req.body.login[1])
  res.render('login');
}


export {
  checkLogin
}