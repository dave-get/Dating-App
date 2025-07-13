import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, Max, IsEmail } from 'class-validator';
import { Gender, LookingFor } from 'generated/prisma';

export class GoogleRegistrationDto {
  @IsNotEmpty()
  @IsString()
  googleId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(LookingFor)
  lookingFor?: LookingFor;
} 