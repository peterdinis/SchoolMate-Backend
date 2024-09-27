import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from 'src/student/student.module';
import { NoteModule } from 'src/note/note.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    StudentModule,
    NoteModule,
    TeacherModule,
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
