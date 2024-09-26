import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { StudentService } from '../student.service';

enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  NOROLE = 'NOROLE',
}

describe('StudentService', () => {
  let service: StudentService;
  let prismaService: PrismaService;

  // Generate mock students with numeric IDs
  const mockStudents = Array.from({ length: 5 }, () => ({
    id: faker.number.int({ min: 1, max: 1000 }), // Use faker.number.int() for generating random numbers
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    class: '4A',
    telephone: faker.phone.number(),
    isExternal: faker.datatype.boolean(),
    role: faker.helpers.arrayElement(Object.values(Role)), // Randomly assign a role from the Role enum
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  // Filter external students for specific tests
  const externalStudents = mockStudents.filter((student) => student.isExternal);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              findMany: jest.fn().mockResolvedValue(mockStudents),
              findFirst: jest.fn().mockImplementation((query) => {
                const student = mockStudents.find(
                  (s) =>
                    s.id === query.where.id &&
                    s.isExternal === query.where.isExternal,
                );
                return student
                  ? Promise.resolve(student)
                  : Promise.resolve(null);
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('findAllStudent', () => {
    it('should return all students', async () => {
      const result = await service.findAllStudent();
      expect(result).toEqual(mockStudents);
      expect(prismaService.student.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException when no students are found', async () => {
      jest.spyOn(prismaService.student, 'findMany').mockResolvedValueOnce([]);
      await expect(service.findAllStudent()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllExternalStudents', () => {
    it('should return all external students', async () => {
      jest
        .spyOn(prismaService.student, 'findMany')
        .mockResolvedValueOnce(externalStudents);
      const result = await service.findAllExternalStudents();
      expect(result).toEqual(externalStudents);
    });

    it('should throw NotFoundException when no external students are found', async () => {
      jest.spyOn(prismaService.student, 'findMany').mockResolvedValueOnce([]);
      await expect(service.findAllExternalStudents()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneStudent', () => {
    it('should return a student by id', async () => {
      const student = mockStudents[0];
      jest
        .spyOn(prismaService.student, 'findFirst')
        .mockResolvedValueOnce(student);
      const result = await service.findOneStudent(student.id);
      expect(result).toEqual(student);
    });

    it('should throw NotFoundException if student is not found', async () => {
      jest
        .spyOn(prismaService.student, 'findFirst')
        .mockResolvedValueOnce(null);
      await expect(service.findOneStudent(faker.number.int())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findExternalDStudent', () => {
    it('should return an external student by id', async () => {
      const student = externalStudents[0];
      jest
        .spyOn(prismaService.student, 'findFirst')
        .mockResolvedValueOnce(student);
      const result = await service.findExternalDStudent(student.id);
      expect(result).toEqual(student);
    });

    it('should throw NotFoundException if external student is not found', async () => {
      jest
        .spyOn(prismaService.student, 'findFirst')
        .mockResolvedValueOnce(null);
      await expect(
        service.findExternalDStudent(faker.number.int()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
