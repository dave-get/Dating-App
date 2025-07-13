import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { PhoneRegistrationDto } from 'src/user/dtos/phoneRegistration.dto';
import { GoogleRegistrationDto } from 'src/user/dtos/googleRegistration.dto';
import { CompleteProfileDto } from 'src/user/dtos/completeProfile.dto';
import { UserService } from 'src/user/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get('/:email')
  findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Post('signup/phone')
  async signupWithPhone(@Body() phoneData: PhoneRegistrationDto) {
    return this.userService.registerUserWithPhone(phoneData);
  }

  @Post('signup/google')
  async signupWithGoogle(@Body() googleData: GoogleRegistrationDto) {
    return this.userService.registerUserWithGoogle(googleData);
  }

  @Put('profile/:userId')
  async completeProfile(
    @Param('userId') userId: string,
    @Body() profileData: CompleteProfileDto,
  ) {
    return this.userService.completeProfile(parseInt(userId), profileData);
  }
}
