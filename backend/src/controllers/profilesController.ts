import { Request, Response } from "express";
import User from "../schemas/User.js";
import { AuthenticatedRequest } from "../interfaces/AuthInterface.js";


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


export const toggleFollowUserFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authUser = req.user;
    const targetUserId = req.body.id;

    if (!authUser) {
      res.status(401).json({ error: "You are not authorized to perform this task!" });
      return;
    }
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

      res.status(200).json({ message: "User unfollowed successfully." });

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

      res.status(200).json({ messaged: 'jj' });
    }

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error while toggling follow status." });
  }
};


export const profileUpdateFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }

    console.log(req.body);
    const { firstname, lastname, bio, username } = req.body;


    const updatedData: any = {
      username,
      firstname,
      lastname,
      bio
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
      res.status(400).json({ error: 'Could not update user!' });
      return;
    }
    res.status(200).json(updatedUser);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error while updating profile!' });
  }
};


export const getUserInfoFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authorized to perform this task!' });
      return;
    }
    const { userId } = req.body;

    const user = await User.findById(userId);

    res.status(200).json(user);

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while fetching user info!' });
  }
}