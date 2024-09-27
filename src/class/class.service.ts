import { Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentsToClassDto } from './dto/add-student-to-class.dto';
import { AssignTeacherDto } from './dto/assign-teacher-to-class.dto';

@Injectable()
export class ClassService {
  constructor(private readonly prismaService: PrismaService) {}

  // Display all classes
  async displayAllClasses() {
    return await this.prismaService.class.findMany({
      include: { students: true, teacher: true },
    });
  }

  // Find one class by ID
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

  // Create a new class
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

  // Add students to a class
  async addStudentsToClass(addStudentsDto: AddStudentsToClassDto) {
    const { classId, studentIds } = addStudentsDto;

    // Check if class exists
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

  // Update class details
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

  // Remove a student from a class
  async removeStudentFromClass(classId: number, studentId: number) {
    // Check if class and student exist
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
      throw new NotFoundException(`Student with ID ${studentId} is not in the class`);
    }

    return await this.prismaService.class.update({
      where: { id: classId },
      data: {
        students: { disconnect: { id: studentId } },
      },
    });
  }

  // Remove all students from a class
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

  // Assign a new teacher to a class
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