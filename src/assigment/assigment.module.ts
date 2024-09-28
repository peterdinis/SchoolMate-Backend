import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AssignmentService } from './assigment.service';
import { AssigmentController } from './assigment.controller';

@Module({
  imports: [PrismaModule],
  providers: [AssignmentService],
  controllers: [AssigmentController],
})
export class AssigmentModule {}
