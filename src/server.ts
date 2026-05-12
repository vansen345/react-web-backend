import { RedisStore } from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import authenRoute from './routes/authen_routes';
import detailRoute from './routes/detail_routes';
import emailRoute from './routes/email_routes';
import homeRoute from './routes/home_routes';
import './type/session';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = createClient({
    url: process.env.REDIS_URL!,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        tls: true,
    }
});

redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.on('reconnecting', () => console.log('Redis reconnecting...'));
redisClient.connect().catch(console.error);

app.set('trust proxy', 1); // ← thêm dòng này trước session
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // ← true khi production
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
   
app.get('/piepapi/services', (req, res) => {
  res.json({ status: 'ok' })
})


mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ MongoDB error:', err));

  
