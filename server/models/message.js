const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    image: {
      type: String,
    },
    seen: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
