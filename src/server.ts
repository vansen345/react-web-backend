import dotenv from 'dotenv';
dotenv.config();

import { RedisStore } from 'connect-redis';
import cors from 'cors';

import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { HomeModel } from './models/home_model';
import { LikeModel } from './models/like_model';
import { IMessage, MessageModel } from './models/message_model';
import authenRoute from './routes/authen_routes';
import messageRoute from './routes/chat_routes';
import commentRoute from './routes/comment_routes';
import detailRoute from './routes/detail_routes';
import emailRoute from './routes/email_routes';
import friendRoute from './routes/friend_routes';
import homeRoute from './routes/home_routes';
import routerUploadMedia from './routes/upload_media_routes';
import userRouter from './routes/user_routes';
import './type/session';



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.set('io', io);


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Gửi tin nhắn
  socket.on('sendMessage', async (data: IMessage, callback) => {
    try {
      console.log('📩 Message:', data);

      await MessageModel.create(data);
      // Gửi cho tất cả trong room
      io.to(data.roomId).emit('receiveMessage', data);

      // báo client thành công
      callback({
        success: true,
        message: 'Message sent',
      });
    } catch (error) {
      callback({
        success: false,
      });
    }
  });

  socket.on('likePost', async (data: { PP300: number, FO100: number, isLiked: boolean }) => {
    try {
      if (data.isLiked) {
        await LikeModel.deleteOne({ PP300: data.PP300, FO100: data.FO100 });
        await HomeModel.findOneAndUpdate({ PP300: data.PP300 }, { $inc: { TOTALLIKES: -1 } });
      } else {
        await LikeModel.create({ PP300: data.PP300, FO100: data.FO100 });
        await HomeModel.findOneAndUpdate({ PP300: data.PP300 }, { $inc: { TOTALLIKES: 1 } });
      }
    } catch (error) {
      console.log(error);
    }
  });


  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

console.log("All env:", {
  REDIS_URL: process.env.REDIS_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
});

console.log("REDIS_URL before connect:", process.env.REDIS_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL!,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    tls: true,
  }
});

// const redisClient = createClient({
//   url: process.env.REDIS_URL!,
// });

redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.on('reconnecting', () => console.log('Redis reconnecting...'));
redisClient.connect().catch(console.error);

console.log('Redis connected');

// console.log(redisClient.options);

app.set('trust proxy', 1); // ← thêm dòng này trước session
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// Routes
app.use('/api/home', homeRoute);
app.use('/api/detail', detailRoute);
app.use('/api/email', emailRoute);
app.use('/api/register', authenRoute);
app.use('/api/login', authenRoute);
app.use('/api/message', messageRoute);
app.use('/api/comment', commentRoute);
app.use('/api/media', routerUploadMedia);
app.use('/api/profile', userRouter);
app.use('/api/friend', friendRoute);

app.get('/piepapi/services', (req, res) => {
  res.json({ status: 'ok' })
})


mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected!');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log('❌ MongoDB error:', err));

