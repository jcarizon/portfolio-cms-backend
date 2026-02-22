import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  IsArray,
  ValidateNested,
} from 'class-validator';

class HeroStatDto {
  @IsString()
  @MaxLength(50)
  label: string;

  @IsString()
  @MaxLength(20)
  value: string;
}

export class UpdateHeroDto {
  @ApiPropertyOptional({ example: 'JC' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  initials?: string;

  @ApiPropertyOptional({ example: 'Jhon Mark Carizon' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({ example: 'Senior Frontend Engineer' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: 'Mandaue City, Cebu, Philippines' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional({ example: '#667eea' })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'gradientFrom must be a valid hex color',
  })
  gradientFrom?: string;

  @ApiPropertyOptional({ example: '#764ba2' })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'gradientTo must be a valid hex color',
  })
  gradientTo?: string;

  @ApiPropertyOptional({ example: [{ label: 'Years', value: '8+' }] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroStatDto)
  stats?: HeroStatDto[];
}
