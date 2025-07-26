import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import connectDatabase from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import profileRoutes from './routes/profilesRoutes.js';
import pinRoutes from './routes/pinRoutes.js';
import path from 'path';
import { mainServer, app } from './socket/socketio.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import commentRoutes from './routes/commentsRoutes.js';

// Constants
dotenv.config();
const PORT = 8080;
const allowedOrigins = ["http://localhost:5173"];

// Middleware
app.use(cors({
  origin: allowedOrigins[0],
  credentials: true
}));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Database
connectDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/comments', commentRoutes);


mainServer.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
