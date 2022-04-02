import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";


function checkLogin (req, res) {
  console.log(req.body.username)
  console.log(req.body.password)
  res.render('login');
}

async function registerUser (req, res) {
  console.log(req.body.username)
  console.log(req.body.password)
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const hashedPassword1 = await bcrypt.hash(req.body.password, 10)
    console.log(hashedPassword)
    console.log(hashedPassword1)
  } catch {
    console.log("Error")
  }
}


export {
  checkLogin,
  registerUser
}