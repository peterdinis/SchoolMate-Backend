import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AssignmentService } from './assigment.service';
import { AssignmentController } from './assigment.controller';

@Module({
  imports: [PrismaModule],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssigmentModule {}
