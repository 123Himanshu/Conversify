const express = require("express");
const {
  handleNewMessage,
  handleAllMessagesForConversation,
  handleDeleteMessage,
} = require("../controllers/message");
const router = express.Router();

router
  .post("/", handleNewMessage)
  .get("/:conversationId", handleAllMessagesForConversation)
  .delete("/:messageId", handleDeleteMessage);

module.exports = router;
