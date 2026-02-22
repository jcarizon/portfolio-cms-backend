import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateExperienceDto {
  @ApiPropertyOptional({ example: 'Senior Frontend Engineer' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  company?: string;

  @ApiPropertyOptional({ example: 'San Francisco, CA' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ example: '2022-03-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-01-15', nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: 'Led development of the main product dashboard...' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}