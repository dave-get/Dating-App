import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GoogleAuthDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  idToken?: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  lookingFor?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
} 