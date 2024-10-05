const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const User = require("../models/user");
const Account = require("../models/account");

function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, callback) {
        try {
          const user = await User.findOne({ email: profile._json.email });
          if (!user) {
            const user = await User.create({
              name: profile._json.name,
              email: profile._json.email,
              image: profile._json.picture,
              account: true,
            });
            const googleAccount = await Account.create({
              userId: user._id,
              provider: profile.provider,
              providerAccountId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
              type: "oauth",
            });
          }
          callback(null, profile);
        } catch (error) {
          console.error("Error creating user or account:", error);
          return res.status(500).json({ msg: "Internal Server Error" });
        }
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      async function (accessToken, refreshToken, profile, callback) {
        try {
          console.log("Github Profile", profile);
          // const user = await User.findOne({ email: profile._json.email });
          // if (!user) {
          //   const user = await User.create({
          //     name: profile._json.name,
          //     email: profile._json.email,
          //     image: profile._json.picture,
          //     account: true,
          //   });
          //   const googleAccount = await Account.create({
          //     userId: user._id,
          //     provider: req.user.provider,
          //     providerAccountId: req.user.id,
          //     accessToken: accessToken,
          //     refreshToken: refreshToken,
          //     type: "oauth",
          //   });
          // }
          callback(null, profile);
        } catch (error) {
          console.error("Error creating user or account:", error);
          return res.status(500).json({ msg: "Internal Server Error" });
        }
      }
    )
  );

  passport.serializeUser((user, callback) => {
    callback(null, user);
  });

  passport.deserializeUser((user, callback) => {
    callback(null, user);
  });
}

module.exports = configurePassport;
