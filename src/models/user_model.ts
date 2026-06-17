import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    FO100: number;
    email: string;
    NV126: string;
    createdAt: Date;
    updatedAt: Date;
    NV106: string;
    isOnline: boolean;
    lastSeen: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        FO100: { type: Number },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
            trim: true
        },
        NV126: {
            type: String,
            default: ""
        },
        NV106: {
            type: String,
            trim: true
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        lastSeen: { type: Date }
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);