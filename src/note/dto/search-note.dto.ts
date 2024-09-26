import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class SearchNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  searchTerm: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  studentId: number;
}
