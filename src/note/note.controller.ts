import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notes')
@Controller('notes')
export class NoteController {}
