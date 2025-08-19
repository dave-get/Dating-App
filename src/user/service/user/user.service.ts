import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma/prisma.service';
import {
  CompleteProfileDto,
  UserLocation,
} from 'src/user/dtos/completeProfile.dto';
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
        profile: {
          include: {
            location: true,
            passion: true,
            lifeStyle: true,
            whatMakesYouUnique: true,
          },
        },
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

    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge)) {
      throw new HttpException('Age must be a valid number', HttpStatus.BAD_REQUEST);
    }
    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        phoneNumber,
        email,
        age: parsedAge,
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

  async createUserProfile(CompleteProfileDto: CompleteProfileDto) {
    const { lookingFor, userId, passion, lifeStyle, whatMakesYouUnique } =
      CompleteProfileDto;

    // Create the profile
    const profile = await this.prisma.profile.create({
      data: {
        lookingFor,
        user: { connect: { id: userId } },
        ...(passion && {
          passion: {
            create: {
              ...(passion.creativity &&
                passion.creativity.length > 0 && {
                  creativity: {
                    create: passion.creativity.map((c) => ({ value: c })),
                  },
                }),
              ...(passion.funAndFavorites &&
                passion.funAndFavorites.length > 0 && {
                  funAndFavorites: {
                    create: passion.funAndFavorites.map((f) => ({ value: f })),
                  },
                }),
              ...(passion.food &&
                passion.food.length > 0 && {
                  food: {
                    create: passion.food.map((f) => ({ value: f })),
                  },
                }),
            },
          },
        }),
        ...(lifeStyle && {
          lifeStyle: {
            create: { ...lifeStyle },
          },
        }),
        ...(whatMakesYouUnique && {
          whatMakesYouUnique: {
            create: { ...whatMakesYouUnique },
          },
        }),
      },
      include: {
        passion: {
          include: {
            creativity: true,
            funAndFavorites: true,
            food: true,
          },
        },
        lifeStyle: true,
        whatMakesYouUnique: true,
      },
    });

    return profile;
  }

  async createUserLocation(location: UserLocation) {
    const { profileId, city, country, latitude, longitude } = location;

    // Create the location
    const createdLocation = await this.prisma.location.create({
      data: {
        profileId,
        city,
        country,
        latitude,
        longitude,
      },
    });

    return createdLocation;
  }

  async removeUser(phoneNumber: string) {
    if (!(await this.findUserByPhone(phoneNumber))) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deletedUser = await this.prisma.user.delete({
      where: { phoneNumber },
    });
    return { message: 'User deleted successfully', user: deletedUser };
  }
}
