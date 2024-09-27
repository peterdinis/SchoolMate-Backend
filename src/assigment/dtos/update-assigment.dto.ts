import { PartialType } from '@nestjs/swagger';
import { CreateAssignmentDto } from './create-assigment.dto';

export class UpdateAssigmentDto extends PartialType(CreateAssignmentDto) {}
