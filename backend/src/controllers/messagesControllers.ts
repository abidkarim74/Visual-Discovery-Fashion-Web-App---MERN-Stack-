import { Response, Request } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthInterface.js";
import { io, getReceivedSocketId } from "../socket/socketio.js";
import User from "../schemas/User.js";
import { Message, Conversation } from "../schemas/Chat.js";
import mongoose, { ObjectId } from "mongoose";
import { sendMessageService } from "../services/sendRealTimeMessage.js";



export const sendMessageFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const { receiverId, text, conversationId } = req.body;
    const receiver = await User.findOne({ _id: receiverId });

    if (!receiver) {
      res.status(404).json({ error: "Receiver user not found!" });
      return;
    }
    const newMessage = await Message.create({
      text,
      sender: {
        _id: req.user.id,
        username: req.user.username,
        profilePic: req.user.profilePic,
      },
      receiver: {
        _id: receiver.id,
        username: receiver.username,
        profilePic: receiver.profilePic,
      },
      conversationId,
    });
    sendMessageService(newMessage, receiverId, req.user);

    await Conversation.updateOne({ _id: conversationId }, { updatedAt: Date.now() });
    
    res.status(200).json("Message sent!");

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while sending message!" });
  }
};


export const getConversationsFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authenticated to perform this task!" });
      return;
    }
    const userId = req.user.id;

    const conversations = await Conversation.find({
      "participants._id": new mongoose.Types.ObjectId(req.user.id)
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversations);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error while fetching conversations!" });
  }
};


export const createConversationFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const { otherId, message } = req.body;
    const receiverUser = await User.findById(otherId);

    if (!receiverUser) {
      res.status(404).json({ error: "User not found!" });
      return;
    }
    let conversation = await Conversation.findOne({
      $and: [
        { "participants._id": new mongoose.Types.ObjectId(req.user.id) },
        { "participants._id": new mongoose.Types.ObjectId(receiverUser.id) },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          {
            _id: req.user.id,
            username: req.user.username,
            profilePic: req.user.profilePic,
          },
          {
            _id: receiverUser.id,
            username: receiverUser.username,
            profilePic: receiverUser.profilePic,
          },
        ],
      });
    }
    const newMessage = await Message.create({
      text: message,
      sender: {
        _id: req.user.id,
        username: req.user.username,
        profilePic: req.user.profilePic,
      },
      receiver: {
        _id: receiverUser.id,
        username: receiverUser.username,
        profilePic: receiverUser.profilePic,
      },
      conversationId: conversation._id,
    });
    sendMessageService(newMessage, receiverUser.id, req.user);

    res.status(200).json({
      message: "Conversation and message created successfully!",
      conversation,
      newMessage,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error while creating conversation!" });
  }
};


export const messagesListFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId });

    console.log(messages);

    res.status(200).json(messages);

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server during fetching the messages!' });
  }
}


export const deleteChats = async (req: Request, res: Response) => {
  try {
    const collection = mongoose.connection.db?.collection("messages");

    const indexes = await collection?.indexes();
    console.log(
      "🔎 Existing indexes:",
      indexes?.map((i) => i.name)
    );

    const unwantedIndexes = [
      "sender.username_1",
      "sender.email_1",
      "receiver.username_1",
      "receiver.email_1",
    ];

    for (const indexName of unwantedIndexes) {
      const exists = indexes?.find((idx) => idx.name === indexName);
      if (exists) {
        await collection?.dropIndex(indexName);
        console.log(`✅ Dropped index: ${indexName}`);
      } else {
        console.log(`ℹ️ Index not found: ${indexName}`);
      }
    }

    const updatedIndexes = await collection?.indexes();
    console.log(
      "✅ Indexes after cleanup:",
      updatedIndexes?.map((i) => i.name)
    );

    await mongoose.connection.close();
    console.log("✅ Connection closed.");
  } catch (err) {
    console.error("❌ Error dropping indexes:", err);
    process.exit(1);
  }
};


export const unreadConversationsFunc = async (req: AuthenticatedRequest, res: Response) => {
  try { 
    if (!req.user) {
    res.status(401).json({ error: 'You are not authorized to perform this task!' });
    return;
    }
    const unseenConversations = await Message.aggregate([
      {
        $match: {
          seen: false,
          "sender._id": { $ne: req.user.id },
        }
      },
    {
      $group: {
        _id: "$conversationId"
      }
    }
    ]);
    const conversationIds = unseenConversations.map(conv => conv._id);

    const conversations = await Conversation.find({
      _id: { $in: conversationIds },
        "participants._id": req.user.id 
    }).populate("participants");

    res.status(200).json(conversations.length);
    
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while fetching messages!' });
  }
}


export const readMessagesFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const conversationId = req.body.conversationId;
    const data = await Message.updateMany(
      {
        conversationId: conversationId,
        "sender._id": { $ne: req.user.id }
      },
      {
        $set: { seen: true }
      }
    );
    res.status(200).json('Messages red successfully!');

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while reading chat!' });
  }
}