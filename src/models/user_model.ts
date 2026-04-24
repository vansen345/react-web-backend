import mongoose from "mongoose";

export interface IUser extends Document {
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);