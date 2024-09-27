import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AssignTeacherDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  classId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  teacherId: number;
}
