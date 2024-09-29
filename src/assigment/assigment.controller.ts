import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAssignmentDto } from './dtos/create-assigment.dto';
import { UpdateAssigmentDto } from './dtos/update-assigment.dto';
import { AssigmentPaginationDto } from './dtos/assigment-pagination.dto';
import { AssigmentSearchDto } from './dtos/assigment-search.dto';
import { AssignmentService } from './assigment.service';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.createAssignment(createAssignmentDto);
  }

  @ApiOperation({ summary: 'Get a list of assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  @Get()
  async getAssignments(
    @Query() paginationDto: AssigmentPaginationDto,
    @Query() searchDto: AssigmentSearchDto,
  ) {
    return this.assignmentService.getAssignments(paginationDto, searchDto);
  }

  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment found' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @Get(':id')
  async findOneAssignment(@Param('id') id: number) {
    return this.assignmentService.findOneAssignment(+id);
  }

  @ApiOperation({ summary: 'Update an assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @Patch(':id')
  async updateAssignment(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssigmentDto,
  ) {
    return this.assignmentService.updateAssignment(+id, updateAssignmentDto);
  }

  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAssignment(@Param('id') id: number) {
    return this.assignmentService.deleteAssignment(+id);
  }
}
