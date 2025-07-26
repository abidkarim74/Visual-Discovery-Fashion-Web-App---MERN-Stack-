import { AuthenticatedRequest } from "../interfaces/AuthInterface.js";
import { Response } from "express";
import { Pin } from "../schemas/Pins.js";
import { Comment } from "../schemas/Pins.js";
import { Notification } from "../schemas/Notification.js";
import { sendNotificationService } from "../services/sendNotifications.js";


export const addCommentFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this action!" });
      return;
    }
    const { text, pinId, context } = req.body;
    const newComment = await Comment.create({
      user: {
        _id: req.user.id,
        username: req.user.username,
        profilePic: req.user?.profilePic,
      },
      text,
    });

    if (!newComment) {
      res.status(400).json({ error: "Could not create a comment!" });
      return;
    }
    const pin = await Pin.findById(pinId);
    if (!pin) {
      res.status(404).json({ error: "Pin not found!" });
      return;
    }
    pin.comments.push(newComment._id);
    pin.save();

    if (pin.creator.username !== req.user.username) {
      const text: string = "commented on your pin";
      const newNotifcation = await Notification.create({
        target: pin.creator._id,
        source: {
          _id: req.user.id,
          username: req.user.username,
          profilePic: req.user.profilePic,
        },
        text,
        context
      });
      sendNotificationService(newNotifcation, pin.creator);
    }

    res.status(200).json(newComment);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while adding a comment!" });
  }
};


export const commentsListFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const pinId = req.params.pinId;

    const pin = await Pin.findById(pinId);
    if (!pin) {
      res.status(404).json({ error: "Pin not found or deleted!" });
      return;
    }
    let comments = [];
    for (let i = 0; i < pin.comments.length; i++) {
      const commentId = pin.comments[i];
      const comment = await Comment.findById(commentId);
      if (comment) {
        comments.push(comment);
      }
    }
    res.status(200).json(comments);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while fetching comments!" });
  }
};
