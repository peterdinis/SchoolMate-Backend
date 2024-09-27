import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Assigments')
@Controller('assigments')
export class AssigmentController {}
