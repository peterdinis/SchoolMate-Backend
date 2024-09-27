import { IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssigmentPaginationDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  page: number = 1;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  limit: number = 10;
}
