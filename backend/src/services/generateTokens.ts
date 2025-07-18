import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from '../interfaces/AuthInterface';


export const generateAccessTokenFunc = (user: AuthenticatedUser) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET does not exist in .env!');
  }
  try {
    const token = jwt.sign({ id: user.id, username: user.username, profilePic: user.profilePic}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    return token;

  } catch (err) {
    console.log('Error while generating tokens!', err);
    process.exit(1);
  }
}


export const generateRefreshTokenFunc = (user: AuthenticatedUser) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET does not exist in .env!');
  }
  try {
    const token = jwt.sign({ id: user.id, username: user.username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return token;

  } catch (err: any) {
    console.log('Error while generating token!', err);
    process.exit(1);
  }
}