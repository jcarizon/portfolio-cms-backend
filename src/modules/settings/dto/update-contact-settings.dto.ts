import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean, MaxLength } from 'class-validator';

export class UpdateContactSettingsDto {
  @ApiPropertyOptional({ example: 'Get In Touch' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  heading?: string;

  @ApiPropertyOptional({ example: "Let's work together!" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'hello@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Send Message' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  buttonText?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showSubjectField?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  requireSubject?: boolean;
}
