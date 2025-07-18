import { Request, Response } from "express";
import User from "../schemas/User.js";
import { hashPasswordFunc } from "../services/hashPassword.js";
import bcrypt from "bcrypt";
import {
  generateAccessTokenFunc,
  generateRefreshTokenFunc,
} from "../services/generateTokens.js";
import { verifyAsync, CustomJwtPayload, AuthenticatedUser, AuthenticatedRequest } from "../interfaces/AuthInterface.js";
import jwt from 'jsonwebtoken';


export const userRegistFunc = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      res
        .status(403)
        .json({
          error: "User with provided username or email already exists!",
        });
      return;
    }
    const hashedPassword = await hashPasswordFunc(password);

    const newUser = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessTokenFunc({
      id: newUser.id,
      username: newUser.username,
      profilePic: newUser.profilePic as string
    });
    const refreshToken = generateRefreshTokenFunc({
      id: newUser.id,
      username: newUser.username,
      profilePic: newUser.profilePic as string

    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({accessToken });
    
  } catch (err: any) {
    console.log(err);
    res.status(500).json("Internal server error while registration!");
  }
};


export const userLoginFunc = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPasswordFunc(password);

    const user = await User.findOne({ username });
    if (!user) {
      res.status(403).json({ error: "User does not exist!" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(403).json({ message: "Password is incorrect!" });
      return;
    }
    const accessToken = generateAccessTokenFunc({
      id: user.id,
      username: user.username,
      profilePic: user.profilePic as string

    });
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw Error("Error");
    }
    const refreshToken = generateRefreshTokenFunc({
      id: user.id,
      username: user.username,
      profilePic: user.profilePic as string

    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "User logged in successfully!", accessToken });

  } catch (err: any) {
    console.log(err);
    res.status(500).json("Internal server error while logging in!");
  }
};


export const refreshTokenFunc = async (req: Request, res: Response) => {
  try {
    const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

    if (!REFRESH_SECRET) {
      throw new Error("Refresh Token key does not exist in .env!");
    }
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "You are not authenticated!" });
      return;
    }
    const decoded = await verifyAsync(refreshToken, REFRESH_SECRET) as CustomJwtPayload;

    if (!decoded) {
      res.status(403).json({error: 'Invalid user!'});
    }
    const user = await User.findOne({ _id: decoded.id });
    console.log('');
    if (!user) {
      res.status(403).json({ error: 'Invalid user!' });
      return;
    }
    const newAccessToken = generateAccessTokenFunc({
      id: decoded.id,
      username: decoded.username,
      profilePic: user.profilePic as string

    });
    res.status(200).json({ accessToken: newAccessToken });

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: "Internal server error while refreshing token" });
  }
};


export const authenticatedUserFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authenticated!' });
      return;
    }
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      res.status(404).json({ error: 'User may have been deleted!' });
      return;
    }
    res.status(200).json({id: user._id, firstname: user.firstname, lastname: user.lastname, username: user.username, profilePic: user.profilePic, email: user.email, followers: user.followers, followings: user.followings, bio:user.bio});
     
  } catch (err:any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while fetching auth user!' });
  }
}


export const logoutFunc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'You are not authenticated' });
    }
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Successfully logged out!' });

  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error while logging out!' });
  }
}