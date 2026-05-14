import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
    roomId: string;
    message: string;
    senderId: string;
    senderEmail: string;
    senderAvatar: string;
    receiverId?: string;
    receiverEmail?: string;
    receiverAvatar?: string;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        roomId: { type: String, required: true },
        message: { type: String, required: true },
        senderId: { type: String, required: true },
        senderEmail: { type: String, required: true },
        senderAvatar: { type: String },
        receiverId: { type: String },
        receiverEmail: { type: String },
        receiverAvatar: { type: String },
    },
    { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);