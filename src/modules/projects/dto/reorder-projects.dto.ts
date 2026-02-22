import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ReorderItemDto {
  @ApiProperty({ example: 'clxyz123' })
  @IsString()
  id: string;
}

export class ReorderProjectsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}