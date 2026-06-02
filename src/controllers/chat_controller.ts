import { Request, Response } from "express";
import { MessageModel } from "../models/message_model";
import { ConversationModel } from "../models/user_chat_model";
import { UserModel } from "../models/user_model";




export const saveMessageNew = async (req: Request, res: Response) => {
    try {

        console.log('body:', req.body);
        const { conversationId, message, senderId, senderEmail, senderAvatar, receiverId, receiverEmail, receiverAvatar } = req.body;

        const sender = await UserModel.findById(senderId).select("user_name").lean();
        const receiver = await UserModel.findById(receiverId).select("user_name").lean();
        const newMessage = await MessageModel.create({
            conversationId,
            message,
            senderId,
            senderEmail,
            senderAvatar,
            receiverId,
            receiverEmail,
            receiverAvatar,
            senderName: sender?.NV106 || "",
            receiverName: receiver?.NV106 || "",
        });
        const io = req.app.get('io');

        // realtime cho receiver
        io.to(receiverId).emit('receiveMessage', newMessage);

        // realtime cho sender
        io.to(senderId).emit('receiveMessage', newMessage);

        console.log('emit to:', receiverId, senderId)

        res.status(200).json({ status: "true", message: "Message saved", elements: 1 });
    } catch (error) {
        console.log('error detail:', error);
        res.status(500).json({ status: "error", message: "Save message failed" });
    }
};

export const getMessagesNew = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const limit = Number(req.query.limit);
        const offset = Number(req.query.offset);
        console.log("conversationId", conversationId);
        const messages = await MessageModel.find({ conversationId: Number(conversationId) }).sort({ createdAt: -1 }).skip(offset).limit(limit);
        console.log("messages", messages);
        res.status(200).json({ status: "true", elements: messages.reverse() });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Get messages failed" });
    }
};

export const getListUserMessagesNew = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const currentEmail = req.headers["x-user-email"] as string;
        const currentUser = await UserModel.findOne({ email: currentEmail });

        if (!currentUser) {
            return res.status(401).json({ status: "error", message: "User not found" });
        }

        const list = await UserModel.find({
            ...(currentEmail && { email: { $ne: currentEmail } })
        }).skip(offset).limit(limit);

        console.log("currentEmail", currentEmail);
        console.log("currentUser", currentUser);

        const listWithLastMessage = await Promise.all(
            list.map(async (user) => {
                // tìm conversation giữa 2 user
                let conversation = await ConversationModel.findOne({
                    $or: [
                        { userOneId: currentUser._id.toString(), userTwoId: user._id.toString() },
                        { userOneId: user._id.toString(), userTwoId: currentUser._id.toString() },
                    ],
                });
                console.log("conversation", conversation);
                console.log("userOneId", currentUser._id.toString());
                console.log("userTwoId", user._id.toString());
                if (!conversation) {
                    console.log("tạo conversation mới");
                    conversation = await ConversationModel.create({
                        conversationId: Math.floor(Math.random() * 900000) + 100000,
                        userOneId: currentUser._id.toString(),
                        userTwoId: user._id.toString(),
                    });
                    console.log("conversation mới", conversation);
                }
                const lastMessage = conversation
                    ? await MessageModel.findOne({ conversationId: conversation.conversationId })
                        .sort({ createdAt: -1 })
                        .select("message createdAt")
                        .lean()
                    : null;

                console.log("conversation trước return", conversation, lastMessage?.message);
                console.log("conversationId value", conversation?.conversationId);
                return {
                    ...user.toObject(),
                    conversationId: conversation?.conversationId || null,
                    lastMessage: lastMessage?.message || "",
                    lastMessageAt: lastMessage?.createdAt || null,
                };
            })
        );

        res.status(200).json({ status: "true", elements: listWithLastMessage });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Get user messages failed" });
    }
};

// export const getOrCreateRoom = async (req: Request, res: Response) => {
//     try {
//         const { senderId, receiverId } = req.body;
//         if (!senderId || !receiverId) {
//             return res.status(400).json({ status: "error", message: "senderId and receiverId are required" });
//         }

//         // Kiểm tra room đã tồn tại chưa
//         const existingRoom = await MessageModel.findOne({
//             $or: [
//                 { senderId, receiverId },
//                 { senderId: receiverId, receiverId: senderId }
//             ]
//         });

//         if (existingRoom) {
//             return res.status(200).json({
//                 status: "true",
//                 elements: existingRoom.roomId
//             });
//         }

//         // Tạo roomId mới
//         const roomId = uuidv4();
//         res.status(200).json({ status: "true", elements: roomId });
//     } catch (error) {
//         res.status(500).json({ status: "error", message: "Get or create room failed" });
//     }
// };