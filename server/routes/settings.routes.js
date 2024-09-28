const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
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
});

module.exports = router;
