import { Request, Response } from 'express';
import Home from '../models/home_model';

export const getList = async (req: Request, res: Response) => {
  try {
    const posts = await Home.find();
    res.json({
      status: 'success',
      timesv: new Date().toISOString(),
      elements: posts,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timesv: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
};

export const getList2 = async (req: Request, res: Response) => {
  try {
    const limit  = Number(req.query.limit)  || 10;  
    const offset = Number(req.query.offset) || 0;   

    const items = await Home.find()
      .skip(offset)
      .limit(limit);

    const total = await Home.countDocuments();

    res.json({
      status: 'success',
      timesv: new Date().toISOString(),
      total,
      limit,
      offset,
      elements: items,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timesv: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const newPost = new Home(req.body);
    const savedPost = await newPost.save();
    res.status(200).json({
      status: 'success',
      timesv: new Date().toISOString(),
      elements: savedPost,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timesv: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
}

