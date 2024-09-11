require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { getUser } = require("./services/auth");
const session = require("express-session");
const bodyParser = require("body-parser");

passportConfig(passport);

app.use(
  cors({
    origin: ["*", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "SouravG",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.json());

app.use("/auth", authRouter);

app.get("/authorization", (req, res) => {
  const userToken = req.cookies?.token;
  console.log(userToken);
  if (!userToken) return res.status(401).json({ msg: "Unauthorized" });
  const user = getUser(userToken);
  console.log(user);
  if (!user) return res.status(401).json({ msg: "Unauthorized" });
  return res.status(200).json({ user, msg: "Authorized" });
});

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

