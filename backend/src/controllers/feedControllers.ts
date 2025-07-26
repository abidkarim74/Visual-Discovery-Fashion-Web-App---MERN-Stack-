import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthInterface";
import { SavedPins } from "../schemas/Feed.js";
import { Pin } from "../schemas/Pins.js";


export const savePinFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const pinId = req.body.id;

    const pin = await Pin.findById(pinId);
    if (!pin) {
      res.status(404).json({ message: "Pin not found" });
      return;
    }
    let savedPins = await SavedPins.findOne({ user: req.user.id });

    if (savedPins) {
      let found: Boolean = false;
      for (let i = 0; i < savedPins.pins.length; i++) {
        if (savedPins.pins[i]._id.toString() === pin._id.toString()) {
          found = true;
        }
      }
      if (found) {
        res.status(403).json({ error: "Pin already saved!" });
        return;
      } else {
        savedPins.pins.push(pin);
        await savedPins.save();
        res.status(200).json("Pin saved successfully!");
        return;
      }
    } else {
      savedPins = await SavedPins.create({ user: req.user.id });
      savedPins.pins.push(pin);
      await savedPins.save();
      res.status(200).json("Pin saved successfully!");
    }
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while saving pin!" });
  }
};


export const savedPinsListFunc = async (req: AuthenticatedRequest,res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const savedPins = await SavedPins.findOne({ user: req.user.id });

    if (!savedPins) {
      res.status(200).json(null);
      return;
    }
    res.status(200).json(savedPins);
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while fetching saved Pins!" });
  }
};


export const unsavePinFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const { pinId } = req.body;

    await SavedPins.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { pins: { _id: pinId } } },
      { new: true }
    );
    res.status(200).json("Pin unsaved successfully!");

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while unsaving pin!" });
  }
};


export const deletePinFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const pinId = req.body.pinId;
    console.log('dsad');
    const result = await Pin.deleteOne({ _id: pinId });

    console.log("Result: ", result);

    if (result.deletedCount===0) {
      res.status(404).json({ error: 'Pin not found or already deleted!' });
      return;
    }
    res.status(200).json({message: 'Pin successfully deleted!'});

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server while deleting pin!' });
  }
}
