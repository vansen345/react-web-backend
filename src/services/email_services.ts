import { Resend } from 'resend';

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error('Send mail error:', error);
    throw error;
  }
};