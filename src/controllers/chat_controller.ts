import { Request, Response } from "express";
import { MessageModel } from "../models/message_model";


export const saveMessage = async (req: Request, res: Response) => {
    try {
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

        res.status(200).json({ status: "true", message: "Message saved", elements: 1 });
    } catch (error) {
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