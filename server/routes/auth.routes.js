const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const { handleSignUp, handleLogin } = require("../controllers/auth");

userRouter
  .post("/signup", handleSignUp)
  .post("/login", handleLogin)

module.exports = userRouter;
