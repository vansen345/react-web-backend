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

export const getDetail = async (req: Request, res: Response) => {
  try {
    const PV325 = req.body.PV325 as string;
    const PP300 = Number(req.body.PP300);
    const FT300 = Number(req.body.FT300);
console.log('Query params:', { PV325, PP300, FT300 }); 
    const item = await Home.findOne({ 
      PV325: PV325,
      PP300: PP300,
      FT300: FT300,
    });

    if (!item) return res.status(404).json({
      status: 'error',
      message: 'Không tìm thấy!'
    });

    res.json({
      status: 'success',
      timesv: new Date().toISOString(),
      elements: item,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server!'
    });
  }
};