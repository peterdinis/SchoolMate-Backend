import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TeacherService } from "./teacher.service";
import { TeacherController } from "./teacher.controller";

@Module({
    imports: [PrismaModule],
    providers: [TeacherService],
    controllers: [TeacherController]
})

export class TeacherModule {}