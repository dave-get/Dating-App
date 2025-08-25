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
    if (!otp || !phoneNumber) {
      return {
        verified: false,
        message: 'OTP and phone number are required',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    const userExists = await this.userService.findUserByPhone(phoneNumber);


    if (session.phoneVerification) {
      const isValid = await this.otpService.verifyOtp(phoneNumber, otp, session);
      if (isValid.verified) {
        return {
          verified: true,
          phoneNumber: isValid.phoneNumber,
          user: userExists,
          message:
            'OTP verified successfully. You can now proceed with registration.',
        };
      }
    }
    console.log(session);
    return {
      message: 'No OTP session found. Please request an OTP first.',
      verified: false,
      status: HttpStatus.BAD_REQUEST,
    };
  }
}
