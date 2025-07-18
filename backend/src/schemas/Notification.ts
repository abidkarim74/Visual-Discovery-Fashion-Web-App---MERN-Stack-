import mongoose from "mongoose";
import { userMiniSchema } from "./Chat.js";


const notificationSchema = new mongoose.Schema({
  text: {
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  source: userMiniSchema,
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  context: {
    type: String,
    default: ''
  },
  seen: {
    type: Boolean,
    default: false
  }
});

export const Notification = mongoose.model('Notification', notificationSchema);