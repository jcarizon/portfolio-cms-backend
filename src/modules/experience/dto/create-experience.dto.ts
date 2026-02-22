import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Senior Frontend Engineer' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  jobTitle: string;

  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  company: string;

  @ApiProperty({ example: 'San Francisco, CA' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  location: string;

  @ApiProperty({ example: '2022-03-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 'Led development of the main product dashboard...' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}