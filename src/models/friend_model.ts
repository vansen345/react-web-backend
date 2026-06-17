import mongoose, { Schema } from "mongoose";

const FriendSchema = new Schema({
    FO100S: { type: Number, required: true },  
    FO100R: { type: Number, required: true },  
    status: { 
        type: String, 
        enum: ["pending", "accepted", "rejected"], 
        default: "pending" 
    },
}, { timestamps: true });

export const FriendModel = mongoose.model("Friend", FriendSchema);