import { AuthenticatedRequest } from "../interfaces/AuthInterface";
import { Response } from "express";
import { Notification } from "../schemas/Notification.js";
import User from "../schemas/User.js";
import { sendNotificationService } from "../services/sendNotifications.js";


export const notificationListFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const notifications = await Notification.find({
      target: req.user?.id,
    }).sort("-createdAt");

    console.log(notifications);

    res.status(200).json(notifications);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};


export const sendNotfictionFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authenticated to perform this task!" });
      return;
    }
    const { receiverId, text } = req.body;

    if (receiverId === req.user.id) {
      res.status(403).json({ error: "You cannot save your own Pins!" });
      return;
    }
    const newNotifcation = await Notification.create({
      target: receiverId,
      source: {
        _id: req.user.id,
        username: req.user.username,
        profilePic: req.user.profilePic,
      },
      text,
    });
    console.log(newNotifcation);
    
    sendNotificationService(newNotifcation, receiverId);

    res.status(201).json("Done");
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server while sending a notification!" });
  }
};


export const unreadReactNotificationFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authenticated to perform this task!" });
      return;
    }
    const unreadNotifications = await Notification.find({ seen: false, target: req.user.id });
    const unreadCount = unreadNotifications.length;

    res.status(200).json(unreadCount);

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error occured!" });
  }
};


export const readNotificationsFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const updated = await Notification.updateMany(
      { target: req.user.id },
      {$set: {seen: true}},
    );
    console.log(updated);
    
    res.status(200).json('Notification read successfully!');

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({error: 'Internal server error while reading notifications!'});
  }
}