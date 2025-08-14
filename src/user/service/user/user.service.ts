import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma/prisma.service';
import { RegistrationDto } from 'src/user/dtos/registration.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        media: true,
      },
    });
  }

  findUserByPhone(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        media: true,
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        media: true,
      },
    });
  }

  async userRegistration(registrationDto: RegistrationDto) {
    const {
      username,
      phoneNumber,
      email,
      age,
      gender,
      distancePreference,
      media,
    } = registrationDto;

    // Check for existing user by email or phone
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        phoneNumber,
        email,
        age,
        gender,
        distancePreference,
        ...(media &&
          media.length > 0 && {
            media: {
              create: media.map((m) => ({
                url: m.url,
              })),
            },
          }),
      },
      include: {
        media: true,
      },
    });

    return user;
  }

  async removeUser(phoneNumber: string) {
    if (!await this.findUserByPhone(phoneNumber)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deletedUser = await this.prisma.user.delete({
      where: { phoneNumber },
    });
    return { message: 'User deleted successfully', user: deletedUser };
  }
}
