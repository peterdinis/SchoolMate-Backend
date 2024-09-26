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

    async findAllExternalStudents() {
        const externalStudents = await this.prismaService.student.findMany({
            where: {
                isExternal: true
            }
        });

        if(!externalStudents) {
            throw new NotFoundException("No external students found");
        }

        return externalStudents;
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

    async findExternalStudent(id: number) {
        const oneExternalStudent = await this.prismaService.student.findFirst({
            where: {
                id,
                isExternal: true
            }
        });

        if(!oneExternalStudent) {
            throw new NotFoundException("No external student with this id exists");
        }

        return oneExternalStudent;
    }
 
}