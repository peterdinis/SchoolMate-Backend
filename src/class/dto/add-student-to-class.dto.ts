import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  ArrayNotEmpty,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class AddStudentsToClassDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  classId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  studentIds: number[];
}
