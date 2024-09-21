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
const conversationRouter = require("./routes/conversation.routes");
const messageRouter = require("./routes/message.routes");
const ws = require("ws");
const passportConfig = require("./passport");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");

passportConfig(passport);

app.use(
  cors({
    origin: ["*", process.env.CLIENT_URL],
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve("./public")));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

app.get("/authorization", async (req, res) => {
  const userToken = req.cookies?.token;
  if (!userToken) return res.status(401).json({ msg: "Unauthorized" });
  const jwtUser = getUser(userToken);
  const user = await User.findOne({ email: jwtUser.email });
  if (!user) return res.status(401).json({ msg: "Unauthorized" });
  return res.status(200).json({ user, msg: "Authorized" });
});

const server = app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

const wss = new ws.Server({ server });

wss.on("connection", (connection) => {
  console.log("Connected");
  connection.send("Hello");
});
