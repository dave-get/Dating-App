import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Gender, LookingFor } from '@prisma/client';
import { CreateMediaDto } from './media.dto';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsInt()
  @Min(18)
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  distancePreference: number;

  @IsNotEmpty()
  media?: CreateMediaDto[];
} 