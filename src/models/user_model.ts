import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true, 
            trim: true 
        },
        avatar: { 
            type: String, 
            default: "" 
        },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);