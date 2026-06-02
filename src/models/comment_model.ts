import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    PP300: number;
    comment: string;
    FO100: number;
    NV106: string;
    NV126: string;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        PP300: { type: Number, default:0 },
        comment: { type: String, default:"" },
        FO100: { type: Number, default: 0 },
        NV106: { type: String },
        NV126: { type: String },
    },
    { timestamps: true }
);

export const CommentModel = mongoose.model<IComment>('Comment', commentSchema);