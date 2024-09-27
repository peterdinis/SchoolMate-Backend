import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssigmentSearchDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Search keyword for assignment name' })
  keyword?: string;
}
