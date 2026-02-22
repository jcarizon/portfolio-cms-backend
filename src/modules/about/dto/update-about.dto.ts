import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class AboutParagraphDto {
  @ApiProperty({ example: 'abc123', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'I am a web developer with 8+ years of experience...' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  text: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateAboutDto {
  @ApiProperty({ type: [AboutParagraphDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutParagraphDto)
  content: AboutParagraphDto[];
}