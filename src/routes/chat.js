const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const chatModel = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;
    let chat = await chatModel
      .findOne({
        participants: { $all: [userId, targetUserId] },
      })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });
    if (!chat) {
      chat = new chatModel({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    return res.status(200).json({
      chat,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});
module.exports = chatRouter;
