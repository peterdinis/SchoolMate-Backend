import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { TeacherService } from './teacher.service';
  import { RegisterTeacherDto } from './dto/register-teacher.dto';
  import { LoginTeacherDto } from './dto/login-teacher.dto';
  import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
  
  @ApiTags('Teachers')
  @Controller('teachers')
  export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all teachers' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully retrieved teachers.',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No teachers found.',
    })
    findAllTeachers() {
      return this.teacherService.findAllTeachers();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a teacher by ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully retrieved teacher.',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Teacher not found.',
    })
    findOneTeacher(@Param('id') id: number) {
      return this.teacherService.findOneTeacher(id);
    }
  
    @Get(':id/classes')
    @ApiOperation({ summary: 'Get all classes for a teacher by ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully retrieved teacher classes.',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Teacher has no class assignments.',
    })
    findAllClassesForTeacher(@Param('id') id: number) {
      return this.teacherService.findAllClassesForTeacher(id);
    }
  
    @Post('register')
    @ApiOperation({ summary: 'Register a new teacher' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Teacher successfully registered.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Failed to register teacher.',
    })
    registerTeacher(@Body() registerTeacherDto: RegisterTeacherDto) {
      return this.teacherService.registerTeacher(registerTeacherDto);
    }
  
    @Post('login')
    @ApiOperation({ summary: 'Teacher login' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Login successful.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid credentials.',
    })
    @HttpCode(HttpStatus.OK)
    login(@Body() loginTeacherDto: LoginTeacherDto) {
      return this.teacherService.login(loginTeacherDto);
    }
  
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() // Adds the Authorization header for Swagger UI
    @ApiOperation({ summary: 'Update teacher profile' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully updated teacher profile.',
    })
    @ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Failed to update teacher profile.',
    })
    updateProfile(
      @Param('id') id: number,
      @Body() updateTeacherDto: UpdateTeacherDto,
    ) {
      return this.teacherService.updateProfile(id, updateTeacherDto);
    }
  }