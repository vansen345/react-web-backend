import { Request, Response } from "express";
import { MessageModel } from "../models/message_model";
import { UserModel } from "../models/user_model";


export const saveMessage = async (req: Request, res: Response) => {
    try {

        console.log('body:', req.body);
        const { roomId, message, senderId, senderEmail, senderAvatar, receiverId, receiverEmail, receiverAvatar } = req.body;

        const newMessage = await MessageModel.create({
            roomId,
            message,
            senderId,
            senderEmail,
            senderAvatar,
            receiverId,
            receiverEmail,
            receiverAvatar,
        });
        const io = req.app.get('io');

        // realtime cho receiver
        io.to(receiverId).emit('receiveMessage', newMessage);

        // realtime cho sender
        io.to(senderId).emit('receiveMessage', newMessage);

        res.status(200).json({ status: "true", message: "Message saved", elements: 1 });
    } catch (error) {
        console.log('error detail:', error);
        res.status(500).json({ status: "error", message: "Save message failed" });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const messages = await MessageModel.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).json({ status: "true", elements: messages });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Get messages failed" });
    }
};

export const getListUserMessages = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const list = await UserModel.find().skip(offset).limit(limit);

        res.status(200).json({ status: "true", elements: list });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Get user messages failed" });
    }
};