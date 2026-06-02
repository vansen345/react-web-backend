// ConversationModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
    conversationId: number;
    userOneId: string;
    userTwoId: string;
    createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        conversationId: { type: Number, unique: true },
        userOneId: { type: String, required: true },
        userTwoId: { type: String, required: true },
    },
    { timestamps: true }
);

export const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);