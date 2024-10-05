const User = require("../models/user");

const handleSettings = async (req, res) => {
  const { name, image, userId } = req.body;
  if (!userId) return res.status(400).send("UserId is required");
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, image },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json("Some Error Has Occured In Server");
  }
};

module.exports = { handleSettings };
