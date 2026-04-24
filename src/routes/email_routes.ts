import { Router } from 'express';
import { sendMail } from '../services/email_services';
import { genOtp, verifyOtp } from '../utils/otp_services';

const router = Router();

router.post('/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const result = await sendMail(to, subject, html);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Send email failed',
    });
  }
});

router.post('/sendOtp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
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
      success: true,
      message: 'OTP sent success'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Send OTP failed', elements: error });
  }
})

router.post('/verifyOtp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and Otp is required'
      })
    }
    const verify = verifyOtp(email, otp)
    if (!verify) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Otp'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'OTP verified'
    })
  } catch (error) {

  }
})

export default router;