import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OtpService {
  async sendOtp(phone: string, otp: string) {
    const IDENTIFIER_ID = process.env.IDENTIFIER_ID;
    const YOUR_SENDER_NAME = 'AfroMessage';
    const YOUR_RECIPIENT = phone;
    const YOUR_MESSAGE = `Your OTP code is: ${otp}`;
    const API_KEY = process.env.AFROMESSAGE_API_KEY;
    const YOUR_CALLBACK = 'https://example.com/callback'; // Replace with your actual callback URL

    // Debug: Check if API key is set
    if (!API_KEY) {
      throw new Error(
        'AFROMESSAGE_API_KEY environment variable is not set. Please add it to your .env file.',
      );
    }

    // Validate API key format (should be a JWT token with 3 parts)
    if (!API_KEY.includes('.') || API_KEY.split('.').length !== 3) {
      throw new Error(
        'Invalid API key format. AFROMESSAGE_API_KEY should be a JWT token with 3 parts separated by periods.',
      );
    }

    const url = `https://api.afromessage.com/api/send?from=${IDENTIFIER_ID}&sender=${YOUR_SENDER_NAME}&to=${YOUR_RECIPIENT}&message=${YOUR_MESSAGE}&callback=${YOUR_CALLBACK}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`, // API expects JWT token format
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log('SMS sent:', data);

      if (data.acknowledge !== 'success') {
        const errorMsg =
          data.response?.errors?.join(', ') ||
          'Unknown error from SMS provider.';
        throw new InternalServerErrorException(`SMS failed: ${errorMsg}`);
      }

      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(
          'Invalid API key. Please check your AFROMESSAGE_API_KEY environment variable.',
        );
      }

      throw new Error('Failed to send OTP. Please try again later.');
    }
  }

  generateOtp(length = 6) {
    return Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, length);
  }

  async verifyOtp(phoneNumber: string, otp: string, session: any) {
    const verification = session?.phoneVerification;
    console.log(
      'verification: ',
      verification,
      verification?.phoneNumber,
      verification?.otp,
    );
    if (
      verification &&
      verification?.otp === otp &&
      verification?.phoneNumber === phoneNumber
    ) {
      session.phoneVerification = {
        ...verification,
        otp: null,
        verified: true,
      };
      return {
        verified: true,
        phoneNumber: verification.phoneNumber,
        message:
          'OTP verified successfully. You can now proceed with registration.',
      };
    }
    console.log(verification);
    return {
      verified: false,
      message: 'Incorrect OTP or phone number mismatch',
    };
  }
}
