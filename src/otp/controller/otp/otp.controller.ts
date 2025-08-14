import {
  Body,
  Controller,
  Post,
  Session,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OtpService } from 'src/otp/service/otp/otp.service';
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
    @Session() session: any,
  ) {
    if (session.phoneVerification) {
      return await this.otpService.verifyOtp(phoneNumber, otp, session);
    }
    console.log(session);
    throw new HttpException(
      'No OTP session found. Please request an OTP first.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
