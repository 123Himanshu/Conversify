const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router
  .post("/", async (req, res) => {
    const { conversationId, sender, text } = req.body;
    try {
      const newMessage = await Message.create({
        conversationId,
        sender,
        message: text,
      });
      res.status(200).json(newMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .get("/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    try {
      const messages = await Message.find({ conversationId });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = router;
