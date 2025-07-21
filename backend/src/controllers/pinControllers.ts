import { AuthenticatedRequest } from "../interfaces/AuthInterface";
import { Response, Request } from "express";
import { Pin } from "../schemas/Pins.js";
import mongoose from "mongoose";
import User from "../schemas/User.js";


export const pinsListFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      res.status(401).json({ error: "You are not authorized to perform this action!" });
      return;
    }
    const page: number = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit: number = Math.min(
      Math.max(parseInt(req.query.limit as string) || 10, 1),
      100
    );
    const skip: number = (page - 1) * limit;

    const [pins, totalPins] = await Promise.all([
      Pin.find({ "creator._id": { $ne: req.user?.id } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Pin.countDocuments(),
    ]);
    res.status(200).json({
      pins,
      totalPins,
      page,
      totalPages: Math.ceil(totalPins / limit),
      hasMore: skip + pins.length < totalPins,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error while fetching the pins!" });
  }
};


export const pinCreateFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authenticated to perform this task!" });
      return;
    }
    const { tags, caption } = req.body;
    if (!req.file) {
      res.status(403).json({ error: "No file exist in the request body" });
      return;
    }
    const newPin = new Pin({
      image: `/uploads/${req.file.filename}`,
      caption,
      tags: JSON.parse(tags),
      creator: {
        _id: req.user.id,
        username: req.user.username,
        profilePic: req.user.profilePic,
      },
    });

    newPin.save();
    res.status(200).json(newPin);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while creating a pin!" });
  }
};


export const makePins = async (req: Request, res: Response) => {
  try {
    // await Pin.deleteMany();

    // res.status(200).json("Done");
    // return;
    const imageUrls = [
      "https://picsum.photos/seed/1/800/600",
      "https://picsum.photos/seed/2/800/600",
      "https://picsum.photos/seed/3/800/600",
      "https://picsum.photos/seed/4/800/600",
      "https://picsum.photos/seed/5/800/600",
      "https://picsum.photos/seed/6/800/600",
      "https://picsum.photos/seed/7/800/600",
      "https://picsum.photos/seed/8/800/600",
      "https://picsum.photos/seed/9/800/600",
      "https://picsum.photos/seed/10/800/600",
      "https://picsum.photos/seed/11/800/600",
      "https://picsum.photos/seed/12/800/600",
      "https://picsum.photos/seed/13/800/600",
      "https://picsum.photos/seed/14/800/600",
      "https://picsum.photos/seed/15/800/600",
      "https://picsum.photos/seed/16/800/600",
      "https://picsum.photos/seed/17/800/600",
      "https://picsum.photos/seed/18/800/600",
      "https://picsum.photos/seed/19/800/600",
      "https://picsum.photos/seed/20/800/600",
      "https://picsum.photos/seed/21/800/600",
      "https://picsum.photos/seed/22/800/600",
      "https://picsum.photos/seed/23/800/600",
      "https://picsum.photos/seed/24/800/600",
      "https://picsum.photos/seed/25/800/600",
      "https://picsum.photos/seed/26/800/600",
      "https://picsum.photos/seed/27/800/600",
      "https://picsum.photos/seed/28/800/600",
      "https://picsum.photos/seed/29/800/600",
      "https://picsum.photos/seed/30/800/600",
    ];

    const captions = [
      "Sunset vibes",
      "Wanderlust",
      "Tech setup",
      "Nature escape",
      "Urban life",
      "Cozy corner",
      "Workout time",
      "Delicious bite",
      "Chill moments",
      "Bookworm zone",
      "Starry skies",
      "Creative flow",
      "Beach breeze",
      "Aesthetic mood",
      "Weekend plans",
      "Bold designs",
      "Golden hour",
      "Coffee time",
      "Quiet night",
      "Adventure begins",
      "Fresh start",
      "Interior dreams",
      "Wild spirit",
      "Roadtrip ready",
      "Mountain trail",
      "Ocean calm",
      "Green escape",
      "Desk goals",
      "Skyline shots",
      "Minimalism",
    ];

    const tagsList = captions.map((caption) =>
      caption.toLowerCase().split(" ")
    );

    // Create and save 30 pins
    for (let i = 0; i < 30; i++) {
      const newPin = new Pin({
        image: imageUrls[i], // Online URL directly
        caption: captions[i],
        tags: tagsList[i],
        creator: "6863e60aba81ef20da866211",
      });

      await newPin.save();
    }

    res.status(200).json({
      message: "✅ 30 pins created successfully using online image URLs.",
    });
  } catch (err: any) {
    console.error("❌ Error creating pins:", err.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};


export const pinDetailFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const id = req.params.id;
    const pin = await Pin.findById(id);

    res.status(200).json(pin);

  } catch (err: any) {
    console.error("Error in pinDetailFunc:", err.message);
    res.status(500).json({ error: "Internal server error while fetching Pin!" });
  }
};


export const authUserPinsFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const pins = await Pin.find({ "creator._id": req?.user?.id });
    console.log(pins);
    res.status(200).json(pins);

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while fetching pins!' });
  }
}