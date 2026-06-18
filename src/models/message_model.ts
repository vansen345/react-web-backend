import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
    conversationId: number;
    roomId: string;
    message: string;
    senderId: string;
    senderEmail: string;
    senderAvatar: string;
    receiverId?: string;
    receiverEmail?: string;
    receiverAvatar?: string;
    senderName?:string;
    receiverName?:string;
    createdAt: Date;
    isRead:boolean;
}

const messageSchema = new Schema<IMessage>(
    {
        conversationId: { type: Number },
        roomId: { type: String },
        message: { type: String, required: true },
        senderId: { type: String, required: true },
        senderEmail: { type: String, required: true },
        senderAvatar: { type: String },
        receiverId: { type: String },
        receiverEmail: { type: String },
        receiverAvatar: { type: String },
        senderName: { type: String },
        receiverName: { type: String },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: true }
);

messageSchema.index({ conversationId: 1 });

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);