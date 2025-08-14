import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  url: string;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  url?: string;
}

export class MediaResponseDto {
  id: number;
  url: string;
  userId: number;
  createdAt: Date;
} 