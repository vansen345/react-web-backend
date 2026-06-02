import { Request, Response } from 'express';
import { CommentModel } from '../models/comment_model';
import Home from '../models/home_model';

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

    const totalComments = await CommentModel.countDocuments({ PP300 });

    if (!item) return res.status(404).json({
      status: 'error',
      message: 'Không tìm thấy!'
    });

    res.json({
      status: 'success',
      timesv: new Date().toISOString(),
      elements: { ...item.toObject(), TOTALCOMMENTS: totalComments },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server!'
    });
  }
};