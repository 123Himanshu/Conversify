const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    lastMessageAt: {
      type: Date,
      default: Date.now(),
    },
    name: {
      type: String,
    },
    isGroup: {
      type: Boolean,
    },
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
