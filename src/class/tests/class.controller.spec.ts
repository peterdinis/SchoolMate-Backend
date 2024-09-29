import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from '../class.controller';
import { ClassService } from '../class.service';
import { AddStudentsToClassDto } from '../dto/add-student-to-class.dto';
import { AssignTeacherDto } from '../dto/assign-teacher-to-class.dto';
import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';

describe('ClassController', () => {
  let classController: ClassController;
  let classService: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        {
          provide: ClassService,
          useValue: {
            displayAllClasses: jest.fn(),
            findOneClass: jest.fn(),
            createClass: jest.fn(),
            addStudentsToClass: jest.fn(),
            updateClass: jest.fn(),
            removeStudentFromClass: jest.fn(),
            removeAllStudentsFromClass: jest.fn(),
            assignNewTeacherToClass: jest.fn(),
          },
        },
      ],
    }).compile();

    classController = module.get<ClassController>(ClassController);
    classService = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(classController).toBeDefined();
  });

  describe('displayAllClasses', () => {
    it('should return an array of classes', async () => {
      const mockClasses = [{ id: 1, name: 'Class A' }];
      (classService.displayAllClasses as jest.Mock).mockResolvedValue(mockClasses);

      const result = await classController.displayAllClasses();
      expect(result).toEqual(mockClasses);
      expect(classService.displayAllClasses).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneClass', () => {
    it('should return a class by ID', async () => {
      const mockClass = { id: 1, name: 'Class A' };
      (classService.findOneClass as jest.Mock).mockResolvedValue(mockClass);

      const result = await classController.findOneClass(1);
      expect(result).toEqual(mockClass);
      expect(classService.findOneClass).toHaveBeenCalledWith(1);
    });
  });

  describe('createClass', () => {
    it('should create a new class', async () => {
      const createClassDto: CreateClassDto = { name: 'Class A', teacherId: 1 };
      const mockClass = { id: 1, name: 'Class A' };
      (classService.createClass as jest.Mock).mockResolvedValue(mockClass);

      const result = await classController.createClass(createClassDto);
      expect(result).toEqual(mockClass);
      expect(classService.createClass).toHaveBeenCalledWith(createClassDto);
    });
  });

  describe('addStudentsToClass', () => {
    it('should add students to a class', async () => {
      const addStudentsDto: AddStudentsToClassDto = { classId: 1, studentIds: [1, 2] };
      const mockClass = { id: 1, name: 'Class A', students: [1, 2] };
      (classService.addStudentsToClass as jest.Mock).mockResolvedValue(mockClass);

      const result = await classController.addStudentsToClass(addStudentsDto);
      expect(result).toEqual(mockClass);
      expect(classService.addStudentsToClass).toHaveBeenCalledWith(addStudentsDto);
    });
  });

  describe('updateClass', () => {
    it('should update a class by ID', async () => {
      const updateClassDto: UpdateClassDto = { name: 'Updated Class A' };
      const mockClass = { id: 1, name: 'Updated Class A' };
      (classService.updateClass as jest.Mock).mockResolvedValue(mockClass);

      const result = await classController.updateClass(1, updateClassDto);
      expect(result).toEqual(mockClass);
      expect(classService.updateClass).toHaveBeenCalledWith(1, updateClassDto);
    });
  });

  describe('removeStudentFromClass', () => {
    it('should remove a student from a class', async () => {
      const mockResponse = { success: true };
      (classService.removeStudentFromClass as jest.Mock).mockResolvedValue(mockResponse);

      const result = await classController.removeStudentFromClass(1, 1);
      expect(result).toEqual(mockResponse);
      expect(classService.removeStudentFromClass).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('removeAllStudentsFromClass', () => {
    it('should remove all students from a class', async () => {
      const mockResponse = { success: true };
      (classService.removeAllStudentsFromClass as jest.Mock).mockResolvedValue(mockResponse);

      const result = await classController.removeAllStudentsFromClass(1);
      expect(result).toEqual(mockResponse);
      expect(classService.removeAllStudentsFromClass).toHaveBeenCalledWith(1);
    });
  });

  describe('assignNewTeacherToClass', () => {
    it('should assign a new teacher to a class', async () => {
      const assignTeacherDto: AssignTeacherDto = { classId: 1, teacherId: 2 };
      const mockClass = { id: 1, name: 'Class A', teacherId: 2 };
      (classService.assignNewTeacherToClass as jest.Mock).mockResolvedValue(mockClass);

      const result = await classController.assignNewTeacherToClass(assignTeacherDto);
      expect(result).toEqual(mockClass);
      expect(classService.assignNewTeacherToClass).toHaveBeenCalledWith(assignTeacherDto);
    });
  });
});