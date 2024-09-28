import { PartialType } from '@nestjs/swagger';
import { RegisterTeacherDto } from './register-teacher.dto';

export class UpdateTeacherDto extends PartialType(RegisterTeacherDto) {}
