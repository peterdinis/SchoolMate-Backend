import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the assignment' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Description of the assignment' })
  desc: string;

  @IsDate()
  @ApiProperty({ description: 'Assignment deadline' })
  deadline: Date;
}
