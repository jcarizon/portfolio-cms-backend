import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio CMS' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'A full-stack portfolio with custom CMS' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({ example: 'Built with Next.js and NestJS' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://myproject.com' })
  @IsOptional()
  @IsString()
  @IsUrl()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/user/repo' })
  @IsOptional()
  @IsString()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional({ example: ['Next.js', 'TypeScript', 'PostgreSQL'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}