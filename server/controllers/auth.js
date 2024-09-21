const User = require("../models/user");

async function handleSignUp(req, res) {
  const { name, email, password } = req.body;
  if (name === "" || email === "" || password === "") {
    return res.status(400).json({ msg: "All Fields Are Required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "User Already Exists" });
  }
  const user = await User.create({ name, email, hashedPassword: password });
  if (user) {
    return res.status(200).json({ msg: "User Created Successfully" });
  } else {
    return res.status(400).json({ msg: "Some Error Has Occured" });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: thirtyDaysInMilliseconds,
    });
    res.status(200).json({ msg: "Login Successful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

async function handleLogout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logout Successful" });
}

module.exports = { handleSignUp, handleLogin, handleLogout };
