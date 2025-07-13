import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Gender, LookingFor } from 'generated/prisma';

export class CompleteProfileDto {
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

  @IsOptional()
  @IsString()
  profilePicture?: string;
} 