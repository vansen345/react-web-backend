import { Request, Response } from "express";
import { FriendModel } from "../models/friend_model";
import { UserModel } from "../models/user_model";

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const { FO100S, FO100R } = req.body;

        const existing = await FriendModel.findOne({
            $or: [
                { FO100S, FO100R },
                { FO100S: FO100R, FO100R: FO100S },
            ]
        });
        if (existing) return res.status(400).json({ status: "error", message: "Request already exists" });

        const friendRequest = await FriendModel.create({ FO100S, FO100R });

        const requester = await UserModel.findOne({ FO100: FO100S });

        // const io = req.app.get('io');
        // io.to(String(FO100R)).emit('friendRequest', {
        //     _id: friendRequest._id,
        //     FO100S,
        //     NV106: requester?.NV106,
        //     NV126: requester?.NV126,
        //     status: "pending",
        // });

        res.status(200).json({ status: "success", message: "Friend request sent", elements: 1 });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Send friend request failed", elements: -1 });
    }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        const { FO100S, FO100R } = req.body;

        await FriendModel.findOneAndUpdate(
            { FO100S, FO100R },
            { status: "accepted" }
        );

        // bắn socket cho người gửi biết đã được chấp nhận
        const recipient = await UserModel.findOne({ FO100: FO100R });
        // const io = req.app.get('io');
        // io.to(String(FO100S)).emit('friendRequestAccepted', {
        //     FO100R,
        //     NV106: recipient?.NV106,
        //     NV126: recipient?.NV126,
        // });

        res.status(200).json({ status: "success", message: "Friend request accepted", elements: 1 });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Accept friend request failed", elements: -1 });
    }
};

export const cancelFriendRequest = async (req: Request, res: Response) => {
    try {
        const { FO100S, FO100R } = req.body;

        await FriendModel.findOneAndDelete({ FO100S, FO100R });

        res.status(200).json({ status: "success", message: "Friend request cancelled", elements: 1 });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Cancel friend request failed", elements: -1 });
    }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
    try {
        const { FO100S, FO100R } = req.body;

        await FriendModel.findOneAndDelete({ FO100S, FO100R });

        res.status(200).json({ status: "success", message: "Friend request rejected", elements: 1 });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Reject friend request failed", elements: -1 });
    }
};

export const unfriend = async (req: Request, res: Response) => {
    try {
        const { FO100S, FO100R } = req.body;

        await FriendModel.findOneAndDelete({
            $or: [
                { FO100S, FO100R, status: "accepted" },
                { FO100S: FO100R, FO100R: FO100S, status: "accepted" },
            ]
        });

        res.status(200).json({ status: "success", message: "Unfriend success", elements: 1 });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Unfriend failed", elements: -1 });
    }
};