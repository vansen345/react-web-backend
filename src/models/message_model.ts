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
    senderName?: string;
    receiverName?: string;
    createdAt: Date;
    isRead: boolean;
    type?: "text" | "sticker" | "image";
    media?: {
        image?: {
            FM600?: number;
            index?: number;
            DES?: string;
            IMG?: string;
            RATIO?: number;
            THUMB?: string;
        }[];
    }

}

const messageSchema = new Schema<IMessage>(
    {
        conversationId: { type: Number },
        roomId: { type: String },
        message: { type: String },
        senderId: { type: String, required: true },
        senderEmail: { type: String, required: true },
        senderAvatar: { type: String },
        receiverId: { type: String },
        receiverEmail: { type: String },
        receiverAvatar: { type: String },
        senderName: { type: String },
        receiverName: { type: String },
        isRead: { type: Boolean, default: false },
        type: { type: String, enum: ["text", "sticker", "image"], default: "text" },

        media: {
            image: [{
                FM600: { type: Number },
                index: { type: Number },
                DES: { type: String, default: "" },
                IMG: { type: String },
                RATIO: { type: Number },
                THUMB: { type: String },
            }],
        }
    },
    { timestamps: true }
);

messageSchema.index({ conversationId: 1 });

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);