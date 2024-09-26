import { Controller, Get, Param, ParseIntPipe, UseGuards, Request, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LoginStudentDto } from './dto/login-student.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

@ApiTags('students') // Group in Swagger UI
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all students' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved students.' })
  @ApiResponse({ status: 404, description: 'No Students found' })
  async findAllStudents() {
    return this.studentService.findAllStudent();
  }

  @Get('external')
  @ApiOperation({ summary: 'Retrieve all external students' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved external students.',
  })
  @ApiResponse({ status: 404, description: 'No external students found' })
  async findAllExternalStudents() {
    return this.studentService.findAllExternalStudents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a student by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Student ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Student found.' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOneStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findOneStudent(id);
  }

  @Get('external/:id')
  @ApiOperation({ summary: 'Retrieve an external student by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'External Student ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'External student found.' })
  @ApiResponse({ status: 404, description: 'External student not found' })
  async findExternalStudent(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findExternalStudent(id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new student' })
  @ApiResponse({ status: 201, description: 'Student registered successfully.' })
  @ApiResponse({ status: 400, description: 'Failed to register student.' })
  async registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
    return this.studentService.registerStudent(registerStudentDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a student' })
  @ApiResponse({ status: 200, description: 'Student logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginStudentDto: LoginStudentDto) {
    return this.studentService.login(loginStudentDto);
  }

  @ApiOperation({
    summary: "User Profile"
  })
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }
}
