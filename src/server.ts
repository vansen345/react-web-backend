import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import detailRoute from './routes/detail_routes';
import homeRoute from './routes/home_routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/home', homeRoute);
app.use('/api/detail', detailRoute);

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

  
