import mongoose from "mongoose";

export interface IUser extends Document {
    email: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        avatar: { type: String, default: "https://res.cloudinary.com/dcu47l2uc/image/upload/v1776849220/copy_of_673761387_1670632933954108_3830695161187199172_n_srcopc_86fa1c.jpg" },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);