import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  private otps = new Map<string, string>();

  async generateOtp(email: string) {
    return new Promise<string>((resolve) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      this.otps.set(email, otp);
      console.log(`Mock OTP for ${email}: ${otp}`);
      resolve(otp);
    });
  }

  async verifyOtp(email: string, otp: string) {
    return new Promise<boolean>((resolve) => {
      resolve(this.otps.get(email) === otp);
    });
  }
}
