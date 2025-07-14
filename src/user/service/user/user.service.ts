import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services/prisma/prisma.service';
import { PhoneRegistrationDto } from '../../dtos/phoneRegistration.dto';
import { GoogleRegistrationDto } from '../../dtos/googleRegistration.dto';
import { CompleteProfileDto } from '../../dtos/completeProfile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  
  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findUserByPhone(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  findUserByGoogleId(googleId: string) {
    return this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: googleId,
        },
      },
      include: { user: true },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Register user with phone number
  async registerUserWithPhone(phoneData: PhoneRegistrationDto) {
    const { phoneNumber, firstname, lastname, ...profileData } = phoneData;

    const existingUser = await this.findUserByPhone(phoneNumber);
    if (existingUser) {
      throw new HttpException('User with this phone number already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.prisma.user.create({
      data: {
        phoneNumber,
        firstname,
        lastname,
        email: `temp_${phoneNumber}@temp.com`, // Temporary email
        verified: true, // Phone is verified through OTP
      },
    });

    // Create account record for phone
    await this.prisma.account.create({
      data: {
        userId: newUser.id,
        provider: 'phone',
        providerAccountId: phoneNumber.toString(),
        type: 'sms',
      },
    });

    return {
      id: newUser.id,
      phoneNumber: newUser.phoneNumber,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      verified: newUser.verified,
    };
  }

  // Register user with Google account
  async registerUserWithGoogle(googleData: GoogleRegistrationDto) {
    const {
      googleId,
      email,
      firstname,
      lastname,
      profilePicture,
      ...profileData
    } = googleData;

    const existingGoogleAccount = await this.findUserByGoogleId(googleId);
    if (existingGoogleAccount) {
      throw new HttpException('User with this Google account already exists', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        firstname,
        lastname,
        phoneNumber: null,
        verified: true, // Google accounts are pre-verified
      },
    });

    await this.prisma.account.create({
      data: {
        userId: newUser.id,
        provider: 'google',
        providerAccountId: googleId,
        type: 'oauth',
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      verified: newUser.verified,
    };
  }

  // Complete user profile
  async completeProfile(userId: number, profileData: CompleteProfileDto) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      const updatedProfile = await this.prisma.profile.update({
        where: { userId },
        data: profileData,
      });
      return updatedProfile;
    } else {
      // Create new profile with required fields
      const newProfile = await this.prisma.profile.create({
        data: {
          userId,
          bio: profileData.bio || '',
          age: profileData.age || 18,
          gender: profileData?.gender || 'MALE',
          location: profileData.location || '',
          lookingFor: profileData.lookingFor || 'DATING',
          profilePicture: profileData.profilePicture || '',
        },
      });
      return newProfile;
    }
  }
}
