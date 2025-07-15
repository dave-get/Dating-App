import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { CompleteProfileDto } from '../../dtos/completeProfile.dto';
import { UserService } from '../../service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('account')
  getUserAccount() {
    return this.userService.getUserAccount();
  }


  @Get('/:email')
  findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Put('profile/:userId')
  async completeProfile(
    @Param('userId') userId: string,
    @Body() profileData: CompleteProfileDto,
  ) {
    return this.userService.completeProfile(parseInt(userId), profileData);
  }
}
