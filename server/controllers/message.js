const Message = require("../models/message");
const Conversation = require("../models/conversation");
const pusherServer = require("../services/pusher");

const handleNewMessage = async (req, res) => {
  const { conversationId, sender, message, image, replyMessage } = req.body;
  // console.log("Requested");
  // console.log("Reply Message", replyMessage);
  try {
    let newMessage = await Message.create({
      conversationId,
      sender,
      body: message,
      image,
      replyMessage: replyMessage?._id || undefined,
    });

    // console.log("New Message", newMessage);

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: newMessage._id },
        lastMessageAt: new Date(),
      },
      { new: true }
    )
      .populate("messages")
      .populate("userIds");

    const populatedMessage = await Message.findById(newMessage?._id)
      .populate("conversationId")
      .populate("sender")
      .populate("seen")
      .populate("replyMessage");

    // console.log("Populated Message", populatedMessage);

    await pusherServer.trigger(
      conversationId,
      "messages:new",
      populatedMessage
    );

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // await pusherServer.trigger(conversationId, "message:last", lastMessage);

    updatedConversation.userIds.map((user) => {
      pusherServer.trigger(user.email, "conversation:update", {
        _id: conversationId,
        messages: [lastMessage],
      });
    });

    res.status(200).json(populatedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleAllMessagesForConversation = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId })
      .populate("seen")
      .populate("sender")
      .populate("conversationId")
      .populate("replyMessage")
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const handleDeleteMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId, {
      new: true,
    });

    console.log("Deleted Message", deletedMessage);

    const updatedConversation = await Conversation.findByIdAndUpdate(
      deletedMessage.conversationId,
      {
        $pull: { messages: { _id: messageId } },
      },
      { new: true }
    )
      .populate("messages")
      .populate("userIds");

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.userIds.map((user) => {
      pusherServer.trigger(user.email, "conversation:update", {
        _id: deletedMessage.conversationId,
        messages: [lastMessage],
      });
    });

    updatedConversation.userIds.map((user) => {
      pusherServer.trigger(user.email, "message:delete", {
        _id: deletedMessage._id,
      });
    });

    res.status(200).json("Message deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  handleNewMessage,
  handleAllMessagesForConversation,
  handleDeleteMessage,
};
