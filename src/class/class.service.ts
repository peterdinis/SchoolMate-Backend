import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClassService {
    constructor(private readonly prismaService: PrismaService) {}

    async displayAlLClasses() {}

    async findOneClass() {}

    async createClass() {}

    async addStudentsToClass() {}

    async updateClass() {}

    async removeStudentFromClass() {}
}