const express = require("express");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const pusherServer = require("../services/pusher");
const router = express.Router();

router
  .post("/", async (req, res) => {
    const { mainUserId, userId, isGroup, members, name } = req.body;
    if (!mainUserId) {
      return res.status(401).json({ msg: "Unauthorized User" });
    }

    if (isGroup == true && (!members || members.length < 0)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    try {
      if (isGroup) {
        const existingGroupConversation = await Conversation.find({
          userIds: {
            $all: [
              mainUserId,
              ...members.map((member) => {
                return member.value;
              }),
            ],
          },
          name: name,
        });

        if (existingGroupConversation.length !== 0) {
          return res.status(201).json(existingGroupConversation);
        }

        const newGroupConversation = await Conversation.create({
          name,
          isGroup,
          userIds: [
            mainUserId,
            ...members.map((member) => {
              return member.value;
            }),
          ],
        }).then((conversation) => {
          return conversation.populate("userIds");
        });

        console.log("New Group Conversation", newGroupConversation);

        newGroupConversation.userIds.forEach((user) => {
          if (user.email) {
            pusherServer.trigger(
              user.email,
              "conversation:new",
              newGroupConversation
            );
          }
        });

        return res.status(200).json(newGroupConversation);
      } else {
        const existingConversation = await Conversation.find({
          $and: [
            { userIds: mainUserId },
            { userIds: userId },
            { isGroup: false },
          ],
        });

        if (existingConversation.length > 0) {
          return res.status(200).json(existingConversation[0]);
        }

        const newConversation = await Conversation.create({
          userIds: [mainUserId, userId],
          isGroup: false,
        }).then((conversation) => {
          return conversation.populate("userIds");
        });

        console.log("New Conversation", newConversation);
        newConversation.userIds.map((user) => {
          if (user.email) {
            pusherServer.trigger(
              user.email,
              "conversation:new",
              newConversation
            );
          }
        });

        return res.status(200).json(newConversation);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .get("/all", async (req, res) => {
    const { userId } = req.query;
    try {
      const conversations = await Conversation.find({
        userIds: userId,
      })
        .populate({
          path: "messages",
          populate: {
            path: "seen",
          },
        })
        .populate("userIds")
        .sort({ lastMessageAt: -1 });

      return res.status(200).json(conversations);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const conversation = await Conversation.findById(id)
        .populate("messages")
        .populate("userIds");
      return res.status(200).json(conversation);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .post("/:conversationId/seen", async (req, res) => {
    const { conversationId } = req.params;
    const { currentUserId } = req.body;
    if (!conversationId || !currentUserId)
      return res.status(400).json({ msg: "Invalid Data" });
    try {
      const conversation = await Conversation.findById(conversationId)
        .populate("messages")
        .populate("userIds");
      // console.log("Conversation:", conversation);

      if (!conversation) return res.status(400).json({ msg: "Invalid Id" });

      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      // console.log("Last Message: ", lastMessage);

      if (!lastMessage) return res.status(400).json({ msg: "No Messages" });

      if (lastMessage.seen.includes(currentUserId))
        return res.status(200).json(lastMessage);

      const updatedMessage = await Message.findByIdAndUpdate(
        lastMessage?._id,
        { $push: { seen: currentUserId } },
        { new: true }
      )
        .populate("seen")
        .populate("sender")
        .populate("conversationId");

      await pusherServer.trigger(conversationId, "conversation:update", {
        _id: conversationId,
        messages: [updatedMessage],
      });

      await pusherServer.trigger(
        conversationId,
        "message:update",
        updatedMessage
      );

      return res.status(200).json(updatedMessage);
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  })
  .delete("/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    try {
      const deletedConversation = await Conversation.findByIdAndDelete(
        conversationId
      ).populate("userIds");

      if (!deletedConversation)
        return res.status(400).json({ msg: "Invalid Id" });

      deletedConversation.userIds.map((user) => {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            "conversation:delete",
            deletedConversation
          );
        }
      });

      return res.status(200).json(deletedConversation);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Something Went Wrong" });
    }
  });

module.exports = router;
