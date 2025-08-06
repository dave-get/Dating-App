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
    session.phoneVerification = { otp, phoneNumber }; // store both together
    await this.otpService.sendOtp(phoneNumber.toString(), otp);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify')
  async verifyOtp(
    @Body('otp') otp: string,
    @Body('phoneNumber') phoneNumber: string,
    @Session() session: any
  ) {
    const verification = session?.phoneVerification;
    console.log("verification: ", verification, verification?.phoneNumber, verification?.otp)
    if (
      verification &&
      verification?.otp === otp &&
      verification?.phoneNumber === phoneNumber
    ) {
      session.phoneVerification = { ...verification, otp: null, verified: true };
      return {
        verified: true,
        phoneNumber: verification.phoneNumber,
        message:
          'OTP verified successfully. You can now proceed with registration.',
      };
    }
    console.log(verification)
    return { verified: false, message: 'Incorrect OTP or phone number mismatch' };
  }

  @Post('register')
  async registerWithPhone(
    @Body() registrationData: PhoneRegistrationDto,
    @Session() session: Record<string, any>,
  ) {
    // Check if OTP was verified for this phone number
    const verification = session.phoneVerification;
    if (
      !verification?.verified ||
      verification.phoneNumber !== registrationData.phoneNumber
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
    session.phoneVerification = null;

    return {
      success: true,
      message: 'User registered successfully',
      user: newUser,
    };
  }
}
