import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
