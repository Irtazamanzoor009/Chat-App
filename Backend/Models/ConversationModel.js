const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    seen: { type: Boolean, default: false },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ConversationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    receiver: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    messages: [{ type: mongoose.Schema.ObjectId, ref: "Messages" }],
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Messages", MessageSchema);
const ConversationModel = mongoose.model("Conversation", ConversationSchema);

module.exports = {
  MessageModel,
  ConversationModel,
};
