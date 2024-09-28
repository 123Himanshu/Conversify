const User = require("../models/user");

const getAllUsers = async (req, res) => {
  const email = req.query.email;
  try {
    const allUsers = await User.find({ email: { $ne: email } });
    return res
      .status(200)
      .json({ msg: "Successfully Fetched All Users", users: allUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { getAllUsers };
