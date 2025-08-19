import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
// import {Location} from 

// DTO for WhatIsYourPassion model
export class WhatIsYourPassionDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  profileId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  creativity?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  funAndFavorites?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  food?: string[];
}

// DTO for LifeStyle model
export class LifeStyleDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  profileId?: number;

  @IsOptional()
  @IsString()
  smoking?: string;

  @IsOptional()
  @IsString()
  drinking?: string;

  @IsOptional()
  @IsString()
  workout?: string;

  @IsOptional()
  @IsString()
  pets?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}

// DTO for WhatMakesYouUnique model
export class WhatMakesYouUniqueDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  profileId?: number;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  howDoYouShowLove?: string;

  @IsOptional()
  @IsString()
  comunicationWay?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;
}

export class UserLocation {
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;
  
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
// Main DTO for Profile model
export class CompleteProfileDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserLocation)
  location?: UserLocation;

  @IsOptional()
  @IsString()
  lookingFor?: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhatIsYourPassionDto)
  passion?: WhatIsYourPassionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LifeStyleDto)
  lifeStyle?: LifeStyleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhatMakesYouUniqueDto)
  whatMakesYouUnique?: WhatMakesYouUniqueDto;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}
