import { Request, Response } from "express";
import { UserModel } from "../models/user_model";
import { sendMail } from "../services/email_services";
import '../type/session';
import { genOtp } from "../utils/otp_services";


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "error", message: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: "error", message: 'Invalid email format' });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ status: "error", message: 'Email already exists' });
        }

        // Tự gen avatar từ email
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
        
        const newUser = await UserModel.create({ email, avatar });
        
        res.status(200).json({ 
            status: "true", 
            message: 'Đăng ký thành công', 
            elements: {
                id: newUser._id,
                email: newUser.email,
                avatar: newUser.avatar,
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: 'Đăng ký không thành công' });
    }
} 

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "error", message: "Email is required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: "error", message: "Invalid email format" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "error", message: "Email not found" });
        }
        const otp = genOtp(email);
        await sendMail(email, "Mã OTP đăng nhập", `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Mã có hiệu lực trong 5 phút.</p>`);
        res.status(200).json({
            status: "true", message: "OTP sent successfully", elements: {
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Login failed", elements: error });
    }
};

export const getInfoLogin = async (req: Request, res: Response) => {
    try {
        const { email } = req.body; // ← đổi từ session sang body
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.status(200).json({
            status: "true",
            message: "Get profile success",
            elements: {
                email: user.email,
                avatar: user.avatar,
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Get profile failed" });
    }
};