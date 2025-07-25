import { Request, Response } from "express";
import User from "../schemas/User.js";
import { AuthenticatedRequest } from "../interfaces/AuthInterface.js";
import { GeneralUser } from "../interfaces/ProfileInterface.js";
import { Pin } from "../schemas/Pins.js";


export const userProfileFunc = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const profile = await User.findOne({ username });

    if (!profile) {
      res.status(404).json({ error: "User does not exist!" });
      return;
    }
    res.status(200).json({
      id: profile.id,
      username: profile.username,
      firstname: profile.firstname,
      lastname: profile.lastname,
      profilePic: profile.profilePic,
      bio: profile.bio,
      followers: profile.followers,
      followings: profile.followings,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


export const toggleFollowUserFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const authUser = req.user;
    const targetUserId = req.body.targetUserId;

    if (!targetUserId) {
      res.status(400).json({ error: "Target user ID is required in request body." });
      return;
    }
    const currentUser = await User.findById(authUser.id);
    if (!currentUser) {
      res.status(404).json({ error: "Authenticated user not found." });
      return;
    }
    const isFollowing = currentUser.followings.includes(targetUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(
        authUser.id,
        { $pull: { followings: targetUserId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        targetUserId,
        { $pull: { followers: authUser.id } },
        { new: true }
      );

      res.status(200).json({ followed: false });
    } else {
      await User.findByIdAndUpdate(
        authUser.id,
        { $addToSet: { followings: targetUserId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        targetUserId,
        { $addToSet: { followers: authUser.id } },
        { new: true }
      );

      res.status(200).json({ followed: true });
    }
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error while toggling follow status." });
  }
};


export const profileUpdateFunc = async (req: AuthenticatedRequest,res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const { firstname, lastname, bio, username } = req.body;

    const updatedData: any = {
      username,
      firstname,
      lastname,
      bio,
    };
    if (req.file) {
      updatedData.profilePic = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(400).json({ error: "Could not update user!" });
      return;
    }
    res.status(200).json(updatedUser);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error while updating profile!" });
  }
};


export const getUserInfoFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const { userId } = req.body;
    const user = await User.findById(userId);

    res.status(200).json(user);

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while fetching user info!" });
  }
};


export const followersListFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: "Auth user not found!" });
      return;
    }
    let followersList: GeneralUser[] = [];

    for (let i = 0; i < user.followers.length; i++) {
      const followerId = user.followers[i];

      const follower = await User.findById(
        followerId,
        "firstname lastname username profilePic"
      ).lean();

      if (follower) {
        const generalUser: GeneralUser = {
          id: follower._id.toString(),
          firstname: follower.firstname,
          lastname: follower.lastname ?? "",
          username: follower.username,
          profilePic: follower.profilePic ?? null,
        };
        followersList.push(generalUser);
      }
    }
    console.log(followersList);

    res.status(200).json(followersList);

    
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      error: "Internal server error while while fetching followers list!",
    });
  }
};


export const followingListFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: "Auth user not found!" });
      return;
    }
    let followingsList: GeneralUser[] = [];

    for (let i = 0; i < user.followings.length; i++) {
      const followerId = user.followings[i];

      const following = await User.findById(
        followerId,
        "firstname lastname username profilePic"
      ).lean();

      if (following) {
        const generalUser: GeneralUser = {
          id: following._id.toString(),
          firstname: following.firstname,
          lastname: following.lastname ?? "",
          username: following.username,
          profilePic: following.profilePic ?? null,
        };
        followingsList.push(generalUser);
      }
    }
    res.status(200).json(followingsList);

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      error: "Internal server error while while fetching followers list!",
    });
  } 
}


export const profilePinsFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const userId = req.params.userId;
    
    const createdPins = await Pin.find({ 'creator._id': userId }).sort('-createdAt');
    res.status(200).json(createdPins);
    
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while fetching profile pins!' });
  }
}