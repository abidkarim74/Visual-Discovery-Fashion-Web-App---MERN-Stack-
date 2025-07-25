import { ref } from "process";
import User from "./User.js";
import mongoose, { mongo } from "mongoose";
import { pinSchema } from "./Pins.js";


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

const savePinsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pins: [pinSchema]
});

export const SavedPins = mongoose.model('SavedPins', savePinsSchema);

export const Feed = mongoose.model('Feed', feedSchema);
