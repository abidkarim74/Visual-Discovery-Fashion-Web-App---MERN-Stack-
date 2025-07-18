import mongoose from "mongoose";
import { userMiniSchema } from "./Chat.js";


const commentSchema = new mongoose.Schema({
  user: {
    type: userMiniSchema,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", commentSchema);


const pinSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  creator: {
    type: userMiniSchema,
    required: true
  },
  caption: String,
  tags: [String],
  likers: [userMiniSchema],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pin = mongoose.model("Pin", pinSchema);

export { Pin, Comment };
