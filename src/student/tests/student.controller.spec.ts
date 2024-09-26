import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { StudentController } from '../student.controller';
import { StudentService } from '../student.service';

// Enum for roles
enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  NOROLE = 'NOROLE',
}

// Mock students array generation
const createMockStudent = () => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  class: '4A',
  telephone: faker.phone.number(),
  isExternal: faker.datatype.boolean(),
  role: faker.helpers.arrayElement(Object.values(Role)), // Randomly assign a role
  createdAt: faker.date.past(), // Add createdAt
  updatedAt: faker.date.recent(), // Add updatedAt
});

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  const mockStudents = Array.from({ length: 5 }, createMockStudent);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            findAllStudent: jest.fn().mockResolvedValue(mockStudents),
            findAllExternalStudents: jest
              .fn()
              .mockResolvedValue(
                mockStudents.filter((student) => student.isExternal),
              ),
            findOneStudent: jest.fn().mockImplementation((id: number) => {
              const student = mockStudents.find((student) => student.id === id);
              return student
                ? Promise.resolve(student)
                : Promise.reject(new NotFoundException());
            }),
            findExternalDStudent: jest.fn().mockImplementation((id: number) => {
              const student = mockStudents.find(
                (student) => student.id === id && student.isExternal,
              );
              return student
                ? Promise.resolve(student)
                : Promise.reject(new NotFoundException());
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAllStudents', () => {
    it('should return all students', async () => {
      const result = await controller.findAllStudents();
      expect(result).toEqual(mockStudents);
      expect(service.findAllStudent).toHaveBeenCalled();
    });

    it('should throw NotFoundException when no students are found', async () => {
      jest.spyOn(service, 'findAllStudent').mockResolvedValueOnce([]);
      await expect(controller.findAllStudents()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllExternalStudents', () => {
    it('should return all external students', async () => {
      const externalStudents = mockStudents.filter(
        (student) => student.isExternal,
      );
      jest
        .spyOn(service, 'findAllExternalStudents')
        .mockResolvedValueOnce(externalStudents);
      const result = await controller.findAllExternalStudents();
      expect(result).toEqual(externalStudents);
      expect(service.findAllExternalStudents).toHaveBeenCalled();
    });

    it('should throw NotFoundException when no external students are found', async () => {
      jest.spyOn(service, 'findAllExternalStudents').mockResolvedValueOnce([]);
      await expect(controller.findAllExternalStudents()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneStudent', () => {
    it('should return a student by ID', async () => {
      const student = mockStudents[0];
      jest.spyOn(service, 'findOneStudent').mockResolvedValueOnce(student);
      const result = await controller.findOneStudent(student.id);
      expect(result).toEqual(student);
      expect(service.findOneStudent).toHaveBeenCalledWith(student.id);
    });

    it('should throw NotFoundException if student is not found', async () => {
      const nonExistentId = faker.number.int({ min: 1001, max: 2000 });
      jest
        .spyOn(service, 'findOneStudent')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOneStudent(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findExternalStudent', () => {
    it('should return an external student by ID', async () => {
      const externalStudent = mockStudents.find(
        (student) => student.isExternal,
      );
      if (externalStudent) {
        jest
          .spyOn(service, 'findExternalDStudent')
          .mockResolvedValueOnce(externalStudent);
        const result = await controller.findExternalStudent(externalStudent.id);
        expect(result).toEqual(externalStudent);
        expect(service.findExternalDStudent).toHaveBeenCalledWith(
          externalStudent.id,
        );
      } else {
        throw new Error('No external student available for testing');
      }
    });

    it('should throw NotFoundException if external student is not found', async () => {
      const nonExistentId = faker.number.int({ min: 1001, max: 2000 });
      jest
        .spyOn(service, 'findExternalDStudent')
        .mockRejectedValueOnce(new NotFoundException());
      await expect(
        controller.findExternalStudent(nonExistentId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
