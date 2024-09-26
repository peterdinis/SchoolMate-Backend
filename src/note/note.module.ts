import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';

@Module({
  imports: [PrismaModule],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
