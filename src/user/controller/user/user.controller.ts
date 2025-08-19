import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Express } from 'express';
import { UserService } from '../../service/user/user.service';
import { RegistrationDto } from 'src/user/dtos/registration.dto';
import {
  CompleteProfileDto,
  UserLocation,
} from 'src/user/dtos/completeProfile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'files', maxCount: 6 },
        { name: 'media', maxCount: 6 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  userRegistration(
    @Body() registrationDto: RegistrationDto,
    @UploadedFiles()
    files:
      | Express.Multer.File[]
      | { files?: Express.Multer.File[]; media?: Express.Multer.File[] },
  ) {
    const normalizedFiles = Array.isArray(files)
      ? files
      : [
          ...((files && files.files) || []),
          ...((files && files.media) || []),
        ];
    return this.userService.userRegistration(registrationDto, normalizedFiles);
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

  @Post('upload/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadUserMedia(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadUserMedia(parseInt(userId, 10), file);
  }
}
