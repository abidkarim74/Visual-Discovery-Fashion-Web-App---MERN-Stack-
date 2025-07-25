import mongoose from "mongoose";
import { userSchema } from "./User.js";



export const userMiniSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    profilePic: { type: String}
  },
  { _id: false }
);


const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true
  },
  sender: userMiniSchema,
  receiver: userMiniSchema,
  text: {
    type: String,
    required: true
  },
  share: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  seen: {
    type: Boolean,
    default: false
  }
});


const Message = mongoose.model("Message", messageSchema);


const conversationSchema = new mongoose.Schema({
  participants: [userMiniSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const Conversation = mongoose.model("Conversation", conversationSchema);

export {Message, Conversation}