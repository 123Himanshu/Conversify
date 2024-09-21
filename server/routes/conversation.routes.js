const express = require("express");
const Conversation = require("../models/conversation");
const router = express.Router();

router
  .post("/", async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
      const newConversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      res.status(200).json({ msg: "New Conversation created successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  })
  .get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const conversations = await Conversation.find({
        members: { $in: [userId] },
      });
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });

module.exports = router;
