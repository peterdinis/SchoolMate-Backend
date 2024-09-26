import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StudentService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAllStudent() {
        const allStudents = await this.prismaService.student.findMany();
        if(!allStudents) {
            throw new NotFoundException("No Students found");
        }

        return allStudents;
    }

    async findOneStudent(id: number) {
        const findStudent = await this.prismaService.student.findFirst({
            where: {
                id
            }
        });

        if(!findStudent) {
            throw new NotFoundException("Student does not exists with this id");
        }

        return findStudent;
    }
 
}