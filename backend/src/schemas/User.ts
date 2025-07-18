import mongoose from "mongoose";


export const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: String,
  profilePic: String,
  bio: String,
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase:true
  },
  age: {
    type: Number,
    min: 0
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  },
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const User = mongoose.model('User', userSchema);

export default User;