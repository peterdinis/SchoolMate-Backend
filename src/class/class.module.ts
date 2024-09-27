import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ClassService } from "./class.service";
import { ClassController } from "./class.controller";

@Module({
    imports: [PrismaModule],
    providers: [ClassService],
    controllers: [ClassController]
})

export class ClassModule {}