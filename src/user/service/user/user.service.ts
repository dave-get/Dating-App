import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma/prisma.service';
import { CloudinaryService } from 'src/user/service/cloudinary/cloudinary.service';
import {
  CompleteProfileDto,
  UserLocation,
} from 'src/user/dtos/completeProfile.dto';
import { RegistrationDto } from 'src/user/dtos/registration.dto';
import type { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

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

  async userRegistration(
    registrationDto: RegistrationDto,
    files?: Express.Multer.File[],
  ) {
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
      throw new HttpException(
        'Age must be a valid number',
        HttpStatus.BAD_REQUEST,
      );
    }
    const parsedDistance = Number(distancePreference);
    if (!Number.isInteger(parsedDistance)) {
      throw new HttpException(
        'Distance preference must be a valid number',
        HttpStatus.BAD_REQUEST,
      );
    }
    // If files are provided, upload to Cloudinary and merge into media
    let combinedMedia = media ?? [];
    if (files && files.length > 0) {
      const uploads = files.map((f) =>
        this.cloudinary.uploadBuffer(f.buffer, f.originalname, {
          folder: process.env.CLOUDINARY_FOLDER,
        }),
      );
      const results = await Promise.all(uploads);
      combinedMedia = [
        ...combinedMedia,
        ...results.map((r) => ({ url: r.secure_url })),
      ];
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        phoneNumber,
        email,
        age: parsedAge,
        gender,
        distancePreference: parsedDistance,
        ...(combinedMedia &&
          combinedMedia.length > 0 && {
            media: {
              create: combinedMedia.map((m) => ({
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
        location: true,
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

  async createUserLocation(locationDto: UserLocation) {
    const { profileId, city, country, latitude, longitude } = locationDto;

    // Create the location
    const createdLocation = await this.prisma.location.create({
      data: {
        profile: { connect: { id: profileId } },
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

  async uploadUserMedia(userId: number, file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    const uploadResult = await this.cloudinary.uploadBuffer(
      file.buffer,
      file.originalname,
      { folder: process.env.CLOUDINARY_FOLDER || 'uploads/users' },
    );

    const media = await this.prisma.media.create({
      data: {
        url: uploadResult.secure_url,
        user: { connect: { id: userId } },
      },
    });

    return { url: media.url, id: media.id };
  }

  // Removed separate register-with-media route; unified into userRegistration
}
