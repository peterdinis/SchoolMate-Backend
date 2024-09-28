import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {}
