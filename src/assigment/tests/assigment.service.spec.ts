import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AssignmentService } from '../assigment.service';
import { CreateAssignmentDto } from '../dtos/create-assigment.dto';
import { UpdateAssigmentDto } from '../dtos/update-assigment.dto';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let prismaService: PrismaService;

  const mockAssignment = {
    id: 1,
    name: 'Test Assignment',
    desc: 'This is a test assignment',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    assigment: {
      create: jest.fn().mockResolvedValue(mockAssignment),
      findMany: jest.fn().mockResolvedValue([mockAssignment]),
      count: jest.fn().mockResolvedValue(1),
      findUnique: jest.fn().mockResolvedValue(mockAssignment),
      update: jest.fn().mockResolvedValue(mockAssignment),
      delete: jest.fn().mockResolvedValue(mockAssignment),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAssignment', () => {
    it('should create an assignment', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        name: 'New Assignment',
        desc: 'New Assignment Description',
        deadline: new Date(),
      };
      const result = await service.createAssignment(createAssignmentDto);
      expect(result).toEqual(mockAssignment);
      expect(prismaService.assigment.create).toHaveBeenCalledWith({
        data: createAssignmentDto,
      });
    });
  });

  describe('getAssignments', () => {
    it('should return a list of assignments with pagination', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const searchDto = { keyword: '' };
      const result = await service.getAssignments(paginationDto, searchDto);
      expect(result).toEqual({
        data: [mockAssignment],
        page: 1,
        limit: 10,
        total: 1,
      });
      expect(prismaService.assigment.findMany).toHaveBeenCalled();
      expect(prismaService.assigment.count).toHaveBeenCalled();
    });
  });

  describe('findOneAssignment', () => {
    it('should return an assignment by ID', async () => {
      const result = await service.findOneAssignment(1);
      expect(result).toEqual(mockAssignment);
      expect(prismaService.assigment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if the assignment does not exist', async () => {
      // Explicitly type the mock to return null
      (prismaService.assigment.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOneAssignment(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAssignment', () => {
    it('should update an existing assignment', async () => {
      const updateAssignmentDto: UpdateAssigmentDto = {
        name: 'Updated Assignment',
        desc: 'Updated Description',
        deadline: new Date(),
      };
      const result = await service.updateAssignment(1, updateAssignmentDto);
      expect(result).toEqual(mockAssignment);
      expect(prismaService.assigment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateAssignmentDto,
      });
    });

    it('should throw a NotFoundException if the assignment does not exist', async () => {
      (prismaService.assigment.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.updateAssignment(99, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAssignment', () => {
    it('should delete an existing assignment', async () => {
      const result = await service.deleteAssignment(1);
      expect(result).toEqual({ message: `Assignment with ID 1 deleted successfully` });
      expect(prismaService.assigment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a NotFoundException if the assignment does not exist', async () => {
      (prismaService.assigment.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteAssignment(99)).rejects.toThrow(NotFoundException);
    });
  });
});