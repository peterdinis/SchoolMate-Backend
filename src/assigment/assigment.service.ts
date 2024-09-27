import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto } from './dtos/create-assigment.dto';
import { AssigmentPaginationDto } from './dtos/assigment-pagination.dto';
import { AssigmentSearchDto } from './dtos/assigment-search.dto';
import { UpdateAssigmentDto } from './dtos/update-assigment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssignmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAssignment(createAssignmentDto: CreateAssignmentDto) {
    const { name, desc, deadline } = createAssignmentDto;
    return await this.prismaService.assigment.create({
      data: { name, desc, deadline },
    });
  }

  async getAssignments(
    paginationDto: AssigmentPaginationDto,
    searchDto: AssigmentSearchDto,
  ) {
    const { page, limit } = paginationDto;
    const { keyword } = searchDto;
    const skip = (page - 1) * limit;

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: Prisma.QueryMode.insensitive } }, // Use Prisma.QueryMode
            { desc: { contains: keyword, mode: Prisma.QueryMode.insensitive } }, // Use Prisma.QueryMode
          ],
        }
      : {};

    const [assignments, total] = await Promise.all([
      this.prismaService.assigment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.assigment.count({ where }),
    ]);

    return {
      data: assignments,
      page,
      limit,
      total,
    };
  }

  async findOneAssignment(id: number) {
    const assignment = await this.prismaService.assigment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async updateAssignment(id: number, updateAssignmentDto: UpdateAssigmentDto) {
    const assignment = await this.prismaService.assigment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return await this.prismaService.assigment.update({
      where: { id },
      data: { ...updateAssignmentDto },
    });
  }

  async deleteAssignment(id: number) {
    const assignment = await this.prismaService.assigment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    await this.prismaService.assigment.delete({
      where: { id },
    });

    return { message: `Assignment with ID ${id} deleted successfully` };
  }
}
