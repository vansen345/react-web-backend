import { Request, Response } from "express";
import { UserModel } from "../models/user_model";
import { sendMail } from "../services/email_services";
import { genOtp } from "../utils/otp_services";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            })
        }
        await UserModel.create({ email })
        const otp = genOtp(email)
        await sendMail(email, 'Mã OTP đăng ký', `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Mã có hiệu lực trong 5 phút.</p>`)
        res.status(200).json({ success: true, message: 'OTP sent successfully',elements:email });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Send OTP failed', elements: error });

    }
}