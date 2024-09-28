import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAllTeachers() {
    const teachers = await this.prismaService.teacher.findMany();
    if (!teachers) {
      throw new NotFoundException('No teachers found');
    }

    return teachers;
  }

  async findOneTeacher(id: number) {
    const oneTeacher = await this.prismaService.teacher.findFirst({
      where: {
        id,
      },
    });

    if (!oneTeacher) {
      throw new NotFoundException('Teacher with this id not found');
    }

    return oneTeacher;
  }

  async findAllClassesForTeacher(id: number) {
    const oneTeacher = await this.prismaService.teacher.findFirst({
      where: {
        id,
        hasClass: true,
      },
    });

    if (!oneTeacher) {
      throw new NotFoundException('Teacher has no classes assigment');
    }

    return oneTeacher;
  }

  async registerTeacher(registerDto: RegisterTeacherDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newTeacher = await this.prismaService.teacher.create({
      data: {
        ...registerDto,
      },
    });

    if (!newTeacher) {
      throw new BadRequestException('Failed to create new teacher');
    }

    if (hashedPassword !== registerDto.password) {
      throw new ForbiddenException('Password does not match');
    }

    return newTeacher;
  }

  async validateTeacher(loginDto: LoginTeacherDto) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { email: loginDto.email },
    });
    if (
      teacher &&
      (await bcrypt.compare(loginDto.password, teacher.password))
    ) {
      const { password, ...result } = teacher;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginTeacherDto) {
    const teacher = await this.validateTeacher(loginDto);
    if (!teacher) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      email: teacher.email,
      sub: teacher.id,
      role: teacher.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
