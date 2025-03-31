const mongoose = require("mongoose");
const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const chatSchema = mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
});

const chatModel = mongoose.model("ChatModel", chatSchema);

module.exports = chatModel;
