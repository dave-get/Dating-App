import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { RegistrationDto } from 'src/user/dtos/registration.dto';
import { CompleteProfileDto, UserLocation } from 'src/user/dtos/completeProfile.dto';

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

  @Post('register')
  userRegistration(@Body() registrationDto: RegistrationDto) {
    // Implement user registration logic here
    return this.userService.userRegistration(registrationDto);
  }

  @Delete('remove/:id')
  removeUser(@Param('id') phoneNumber: string) {
    return this.userService.removeUser(phoneNumber);
  }

  @Post('profile')
  createUserProfile(@Body() completeProfileDto: CompleteProfileDto) {
    return this.userService.createUserProfile(completeProfileDto);
  }

  @Post('location')
  createUserLocation(@Body() location: UserLocation) {
    return this.userService.createUserLocation(location);
  }
}
