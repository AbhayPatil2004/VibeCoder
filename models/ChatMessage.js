import mongoose, { Schema, model, models } from "mongoose";

const chatMessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatMessage =
  models.ChatMessage || model("ChatMessage", chatMessageSchema);

export default ChatMessage;
