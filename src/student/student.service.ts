import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterStudentDto } from './dto/register-student.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { Student } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAllStudent() {
    const allStudents = await this.prismaService.student.findMany();
    if (!allStudents) {
      throw new NotFoundException('No Students found');
    }

    return allStudents;
  }

  async findAllExternalStudents() {
    const externalStudents = await this.prismaService.student.findMany({
      where: {
        isExternal: true,
      },
    });

    if (!externalStudents) {
      throw new NotFoundException('No external students found');
    }

    return externalStudents;
  }

  async findOneStudent(id: number) {
    const findStudent = await this.prismaService.student.findFirst({
      where: {
        id,
      },
    });

    if (!findStudent) {
      throw new NotFoundException('Student does not exists with this id');
    }

    return findStudent;
  }

  async findExternalStudent(id: number) {
    const oneExternalStudent = await this.prismaService.student.findFirst({
      where: {
        id,
        isExternal: true,
      },
    });

    if (!oneExternalStudent) {
      throw new NotFoundException('No external student with this id exists');
    }

    return oneExternalStudent;
  }

  async findAllExpelledStudents() {
    const expelledStudents = await this.prismaService.student.findMany({
      where: {
        isExpelled: true,
      },
    });
    if (!expelledStudents) {
      throw new NotFoundException('No Expelled Students found');
    }

    return expelledStudents;
  }

  async findOneExpelledStudent(id: number) {
    const oneExpelledStudent = await this.prismaService.student.findFirst({
      where: {
        id,
        isExpelled: true,
      },
    });
    if (!oneExpelledStudent) {
      throw new NotFoundException('Expelled student does not exists');
    }

    return oneExpelledStudent;
  }

  async registerStudent(studentDto: RegisterStudentDto) {
    const hashedPassword = await bcrypt.hash(studentDto.password, 10);

    const newStudent = await this.prismaService.student.create({
      data: {
        ...studentDto,
      },
    });

    if (!newStudent) {
      throw new BadRequestException('Failed to create new student');
    }

    if (hashedPassword !== studentDto.password) {
      throw new ForbiddenException('Password does not match');
    }

    return newStudent;
  }

  async validateStudent(loginDto: LoginStudentDto) {
    const student = await this.prismaService.student.findUnique({
      where: { email: loginDto.email },
    });
    if (
      student &&
      (await bcrypt.compare(loginDto.password, student.password))
    ) {
      const { password, ...result } = student;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginStudentDto) {
    const student = await this.validateStudent(loginDto);
    if (!student) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      email: student.email,
      sub: student.id,
      role: student.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
