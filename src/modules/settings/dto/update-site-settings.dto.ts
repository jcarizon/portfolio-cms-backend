import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional({ example: 'My Portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  siteTitle?: string;

  @ApiPropertyOptional({ example: 'Full-Stack Developer' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  siteTagline?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username' })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/username' })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiPropertyOptional({ example: 'https://myportfolio.com' })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiPropertyOptional({ example: '© 2025 John Doe. All rights reserved.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  footerText?: string;
}