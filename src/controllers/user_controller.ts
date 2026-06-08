import { Request, Response } from 'express';
import { CommentModel } from '../models/comment_model';
import { HomeModel } from '../models/home_model';
import { LikeModel } from '../models/like_model';
import { UserModel } from '../models/user_model';

export const getProfile = async (req: Request, res: Response) => {
    try {

        const FO100 = Number(req.body.FO100) || 0;
        const user = await UserModel.findOne({ FO100 });
        console.log(user);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        res.json({
            status: 'success',
            elements: {
                FO100: user.FO100,
                NV106: user.NV106,
                NV126: user.NV126,
                email: user.email,
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            timesv: new Date().toISOString(),
            message: 'Internal server error',
        });
    }
}

export const getPostByUser = async (req: Request, res: Response) => {
    try {
        const FO100 = Number(req.body.FO100);
        const limit = Number(req.body.limit) || 10;
        const offset = Number(req.body.offset) || 0;

        const posts = await HomeModel.find({ FO100 })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);


        const itemHomeNew = await Promise.all(
            posts.map(async (item) => {
                const totalComments = await CommentModel.countDocuments({ PP300: item.PP300 });
                const liked = FO100 ? await LikeModel.findOne({ PP300: item.PP300, FO100 }) : null;
                return {
                    ...item.toObject(),
                    TOTALCOMMENTS: totalComments,
                    ISLIKED: liked ? 1 : 0,
                }
            })
        );

        res.json({
            status: 'success',
            elements: itemHomeNew,

        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

