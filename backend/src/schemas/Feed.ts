import { ref } from "process";
import User from "./User";
import mongoose from "mongoose";


const feedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preference: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
  }
});

export const Feed = mongoose.model('Feed', feedSchema);
