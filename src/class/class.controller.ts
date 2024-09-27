import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentsToClassDto } from './dto/add-student-to-class.dto';
import { AssignTeacherDto } from './dto/assign-teacher-to-class.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @ApiOperation({ summary: 'Display all classes' })
  async displayAllClasses() {
    return await this.classService.displayAllClasses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific class by ID' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  async findOneClass(@Param('id') id: number) {
    return await this.classService.findOneClass(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  async createClass(@Body() createClassDto: CreateClassDto) {
    return await this.classService.createClass(createClassDto);
  }

  @Post('students')
  @ApiOperation({ summary: 'Add students to a class' })
  async addStudentsToClass(@Body() addStudentsDto: AddStudentsToClassDto) {
    return await this.classService.addStudentsToClass(addStudentsDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update class details' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  async updateClass(
    @Param('id') id: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return await this.classService.updateClass(id, updateClassDto);
  }

  @Delete(':classId/students/:studentId')
  @ApiOperation({ summary: 'Remove a student from a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  async removeStudentFromClass(
    @Param('classId') classId: number,
    @Param('studentId') studentId: number,
  ) {
    return await this.classService.removeStudentFromClass(classId, studentId);
  }

  @Delete(':classId/students')
  @ApiOperation({ summary: 'Remove all students from a class' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  async removeAllStudentsFromClass(@Param('classId') classId: number) {
    return await this.classService.removeAllStudentsFromClass(classId);
  }

  @Patch(':classId/teacher')
  @ApiOperation({ summary: 'Assign a new teacher to a class' })
  async assignNewTeacherToClass(@Body() assignTeacherDto: AssignTeacherDto) {
    return await this.classService.assignNewTeacherToClass(assignTeacherDto);
  }
}
