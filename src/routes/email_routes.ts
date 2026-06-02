import { Router } from 'express';
import { UserModel } from '../models/user_model';
import { sendMail } from '../services/email_services';
import { genOtp, verifyOtp } from '../utils/otp_services';

const emailRoute = Router();

emailRoute.post('/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const result = await sendMail(to, subject, html);

    res.json({
      status: "true",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: 'Send email failed',
    });
  }
});

emailRoute.post('/sendOtp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "false",
        message: 'Email is required'
      })

    }
    const otp = genOtp(email)
    // await sendMail(
    //   email,
    //   'Mã OTP đăng nhập',
    //   `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Mã có hiệu lực trong 5 phút.</p>`
    // );

    await sendMail(email, 'Mã OTP đăng nhập', `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Mã có hiệu lực trong 5 phút.</p>`)
    res.status(200).json({
      status: "true",
      message: 'OTP sent success'
    })
  } catch (error) {
    res.status(500).json({ status: "false", message: 'Send OTP failed', elements: error });
  }
})

emailRoute.post('/verifyOtp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        elements: -2,
        status: "false",
        message: 'Email and Otp is required'
      })
    }
    const verify = verifyOtp(email, otp)
    if (!verify) {
      return res.status(400).json({
        elements: -1,
        status: "false",
        message: 'Invalid Otp'
      })
    }

    const user = await UserModel.findOne({ email });

    (req.session as any).user = {
        email: user?.email,
        avatar: user?.NV126,
    };

    return res.status(200).json({
      status: "true",
      message: 'OTP verified',
      elements: 1,
    })
  } catch (error) {
    res.status(500).json({ status: "error", message: "Verify OTP failed" });
  }
})

export default emailRoute;