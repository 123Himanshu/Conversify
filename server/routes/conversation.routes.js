const express = require("express");
const {
  handleNewConversation,
  handleGettingAllConversations,
  handleConversationById,
  handleSeen,
  handleDeleteConversation,
} = require("../controllers/conversation");
const router = express.Router();

router
  .post("/", handleNewConversation)
  .get("/all", handleGettingAllConversations)
  .get("/:id", handleConversationById)
  .post("/:conversationId/seen", handleSeen)
  .delete("/:conversationId", handleDeleteConversation);

module.exports = router;
