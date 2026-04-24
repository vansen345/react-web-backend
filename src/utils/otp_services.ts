import crypto from "crypto";

const otpStore = new Map<string, { otp: string, expiredAt: number }>();

export const genOtp = (email: string) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiredAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiredAt });
    return otp;
};

export const verifyOtp = (email:string,otp:string)=>{
    const verify = otpStore.get(email);
    if(!verify)return false;
    if(Date.now() > verify.expiredAt){
      otpStore.delete(email);
      return false;
    }
    if(verify.otp!== otp)return false;
    otpStore.delete(email);
    return true;
}