import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentsToClassDto } from './dto/add-student-to-class.dto';
import { AssignTeacherDto } from './dto/assign-teacher-to-class.dto';

@Injectable()
export class ClassService {
  constructor(private readonly prismaService: PrismaService) {}

  async displayAllClasses() {
    const classes = await this.prismaService.class.findMany({
      include: { students: true, teacher: true },
    });

    if (!classes) {
      throw new NotFoundException('No classes was created');
    }

    return classes;
  }

  async findOneClass(id: number) {
    const classData = await this.prismaService.class.findUnique({
      where: { id },
      include: { students: true, teacher: true },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classData;
  }

  async createClass(createClassDto: CreateClassDto) {
    const { name, teacherId } = createClassDto;

    const teacher = await this.prismaService.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return await this.prismaService.class.create({
      data: {
        name,
        teacher: { connect: { id: teacherId } },
      },
    });
  }

  async addStudentsToClass(addStudentsDto: AddStudentsToClassDto) {
    const { classId, studentIds } = addStudentsDto;

    const classData = await this.prismaService.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    return await this.prismaService.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: studentIds.map((id) => ({ id })),
        },
      },
    });
  }

  async updateClass(id: number, updateClassDto: UpdateClassDto) {
    const classData = await this.prismaService.class.findUnique({
      where: { id },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return await this.prismaService.class.update({
      where: { id },
      data: { ...updateClassDto },
    });
  }

  async removeStudentFromClass(classId: number, studentId: number) {
    const classData = await this.prismaService.class.findUnique({
      where: { id: classId },
      include: { students: true },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const studentExists = classData.students.some(
      (student) => student.id === studentId,
    );

    if (!studentExists) {
      throw new NotFoundException(
        `Student with ID ${studentId} is not in the class`,
      );
    }

    return await this.prismaService.class.update({
      where: { id: classId },
      data: {
        students: { disconnect: { id: studentId } },
      },
    });
  }

  async removeAllStudentsFromClass(classId: number) {
    const classData = await this.prismaService.class.findUnique({
      where: { id: classId },
      include: { students: true },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    return await this.prismaService.class.update({
      where: { id: classId },
      data: { students: { set: [] } },
    });
  }

  async assignNewTeacherToClass(assignTeacherDto: AssignTeacherDto) {
    const { classId, teacherId } = assignTeacherDto;

    const classData = await this.prismaService.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const teacher = await this.prismaService.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return await this.prismaService.class.update({
      where: { id: classId },
      data: {
        teacher: { connect: { id: teacherId } },
      },
    });
  }
}
