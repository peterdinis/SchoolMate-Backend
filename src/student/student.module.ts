import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // replace with a secure key in production
      signOptions: { expiresIn: '1h' }, // token expiry time
    }),
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
