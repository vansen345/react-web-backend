import { Request, Response } from "express";
import admin from 'firebase-admin';
import { firestore } from '../configs/firebase_configs';
import { CommentModel } from '../models/comment_model';
import { HomeModel } from "../models/home_model";

export const insertComment = async (req: Request, res: Response) => {
    try {
        const { PP300, comment, FO100, NV106, NV126 } = req.body;

        if (!PP300 || !comment) {
            return res.status(400).json({ status: 'error', message: 'postId và comment là bắt buộc' });
        }

        // lưu vào MongoDB
        const newComment = await CommentModel.create({
            PP300,
            comment,
            FO100,
            NV106,
            NV126,
        });
        await HomeModel.findOneAndUpdate(
            { PP300 },
            { $inc: { TOTALCOMMENTS: 1 } }
        );

        console.log(newComment);


        // bắn event vào Firestore
        await firestore.collection('comments').add({
            PP300,
            comment,
            FO100,
            NV106,
            NV126,
            mongoId: newComment._id.toString(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ status: 'success', elements: newComment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Insert comment failed' });
    }

};
export const getListComment = async (req: Request, res: Response) => {
    try {
        const { PP300 } = req.params;
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        const comments = await CommentModel.find({ PP300: Number(PP300) })
            .sort({ createdAt: 1 })
            .skip(offset)
            .limit(limit);
        const totalComment = await CommentModel.countDocuments({ PP300: Number(PP300) });

        res.status(200).json({ status: 'success', elements: comments, total: totalComment });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Get list comment failed' });
    }
};