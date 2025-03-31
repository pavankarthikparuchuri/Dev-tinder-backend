const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //Handle Events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      socket.join(getSecretRoomId(userId, targetUserId));
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        //save messages to the database
        try {
          let connection = await ConnectionRequestModel.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });
          if (!connection) {
            return;
          }
          let chat = await chatModel.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new chatModel({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });
          await chat.save();
          io.to(getSecretRoomId(userId, targetUserId)).emit("messageReceived", {
            firstName,
            senderId: userId,
            lastName,
            text,
          });
        } catch (err) {
          console.log(err.message, "::error");
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
