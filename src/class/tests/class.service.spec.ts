import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClassService } from '../class.service';

describe('ClassService', () => {
  let classService: ClassService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassService,
        {
          provide: PrismaService,
          useValue: {
            class: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            teacher: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    classService = module.get<ClassService>(ClassService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findOneClass', () => {
    it('should return a class when found', async () => {
      const mockClass = { id: 1, name: 'Class A', students: [], teacher: {} };

      // Mocking Prisma class.findUnique to return a class
      (prismaService.class.findUnique as jest.Mock).mockResolvedValue(mockClass);

      const result = await classService.findOneClass(1);
      expect(result).toEqual(mockClass);
    });

    it('should throw NotFoundException if class is not found', async () => {
      // Mocking Prisma class.findUnique to return null
      (prismaService.class.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(classService.findOneClass(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createClass', () => {
    it('should create a new class', async () => {
      const mockTeacher = { id: 1, name: 'Teacher A' };
      const mockClass = { id: 1, name: 'Class A', teacherId: 1 };

      // Mocking Prisma teacher.findUnique and class.create
      (prismaService.teacher.findUnique as jest.Mock).mockResolvedValue(mockTeacher);
      (prismaService.class.create as jest.Mock).mockResolvedValue(mockClass);

      const createClassDto = { name: 'Class A', teacherId: 1 };
      const result = await classService.createClass(createClassDto);
      expect(result).toEqual(mockClass);
    });

    it('should throw NotFoundException if teacher is not found', async () => {
      // Mocking Prisma teacher.findUnique to return null
      (prismaService.teacher.findUnique as jest.Mock).mockResolvedValue(null);

      const createClassDto = { name: 'Class A', teacherId: 1 };
      await expect(classService.createClass(createClassDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});