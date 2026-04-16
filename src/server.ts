import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import homeRoute from './routes/home_routes'; // ← thêm

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/home', homeRoute); // ← thêm

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('❌ MongoDB error:', err));

  
