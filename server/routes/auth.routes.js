const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const {
  handleSignUp,
  handleLogin,
  handleLogout,
} = require("../controllers/auth");
const User = require("../models/user");
const Account = require("../models/account");
const cors = require("cors");
const { setUser } = require("../services/auth");

userRouter.use(
  cors({
    origin: [
      "*",
      process.env.CLIENT_URL,
      "https://newconversify.vercel.app",
      "https://conversify-git-main-sourav-goyal.vercel.app",
      "https://conversify-7wgzlz6q7-sourav-goyal.vercel.app",
      "http://localhost:3000",
    ],
  })
);

userRouter
  .post("/signup", handleSignUp)
  .post("/login", handleLogin)
  .get("/logout", handleLogout)
  .get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )
  .get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/success",
      failureRedirect: "/auth/failure",
    })
  )
  .get("/success", async (req, res) => {
    if (req.user) {
      const user = await User.findOne({ email: req.user.emails[0].value });
      const token = setUser(user);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.redirect(process.env.CLIENT_URL);
    }
  })
  .get("/failure", (req, res) => {
    return res.redirect(process.env.CLIENT_URL);
  })
  .get("/login/success", async (req, res) => {
    if (req.user) {
      const user = await User.findOne({ email: req.user.emails[0].value });
      res.status(200).json({ msg: "User Logged In successfully", user: user });
    } else {
      res.status(401).json({ msg: "User Not Found" });
    }
  });

module.exports = userRouter;
