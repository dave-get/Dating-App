import {
  Body,
  Controller,
  Post,
  Session,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OtpService } from 'src/otp/service/otp/otp.service';
import { PhoneRegistrationDto } from '../../../user/dtos/phoneRegistration.dto';
import { UserService } from 'src/user/service/user/user.service';

@Controller('otp')
export class OtpController {
  constructor(
    private otpService: OtpService,
    private userService: UserService,
  ) {}

  @Post('send')
  async sendOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Session() session: any,
  ) {
    // Check if user already exists
    const existingUser = await this.userService.findUserByPhone(phoneNumber);
    if (existingUser) {
      throw new HttpException(
        'User with this phone number already exists',
        HttpStatus.CONFLICT,
      );
    }

    const otp = this.otpService.generateOtp();
    session.otp = otp; // store for later verification
    session.phoneNumber = phoneNumber; // store phone number for registration
    await this.otpService.sendOtp(phoneNumber.toString(), otp);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify')
  async verifyOtp(@Body('otp') otp: string, @Session() session: any) {
    if (session.otp === otp) {
      // Clear OTP from session after successful verification
      session.otp = null;
      // Set flag to indicate phone is verified
      session.phoneVerified = true;
      console.log({
        verified: true,
        phoneNumber: session.phoneNumber,
        message:
          'OTP verified successfully. You can now proceed with registration.',
      });
      return {
        verified: true,
        phoneNumber: session.phoneNumber,
        message:
          'OTP verified successfully. You can now proceed with registration.',
      };
    }
    return { verified: false, message: 'Incorrect OTP' };
  }

  @Post('register')
  async registerWithPhone(
    @Body() registrationData: PhoneRegistrationDto,
    @Session() session: Record<string, any>,
  ) {
    // Check if OTP was verified for this phone number
    console.log('Session data:', session.phoneVerified, session.phoneNumber);
    if (
      !session?.phoneVerified ||
      session.phoneNumber !== registrationData.phoneNumber
    ) {
      throw new HttpException(
        'Phone number not verified. Please verify OTP first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Register the user
    const newUser =
      await this.userService.registerUserWithPhone(registrationData);

    // Clear session data after successful registration
    session.phoneVerified = null;
    session.phoneNumber = null;

    return {
      success: true,
      message: 'User registered successfully',
      user: newUser,
    };
  }
}
