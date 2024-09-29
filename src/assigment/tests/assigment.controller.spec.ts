import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentController } from '../assigment.controller';
import { AssignmentService } from '../assigment.service';
import { CreateAssignmentDto } from '../dtos/create-assigment.dto';
import { UpdateAssigmentDto } from '../dtos/update-assigment.dto';

describe('AssignmentController', () => {
  let controller: AssignmentController;
  let service: AssignmentService;

  const mockAssignment = {
    id: 1,
    name: 'Test Assignment',
    desc: 'This is a test assignment',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAssignmentService = {
    createAssignment: jest.fn().mockResolvedValue(mockAssignment),
    getAssignments: jest.fn().mockResolvedValue({
      data: [mockAssignment],
      page: 1,
      limit: 10,
      total: 1,
    }),
    findOneAssignment: jest.fn().mockResolvedValue(mockAssignment),
    updateAssignment: jest.fn().mockResolvedValue(mockAssignment),
    deleteAssignment: jest.fn().mockResolvedValue({
      message: `Assignment with ID 1 deleted successfully`,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [
        {
          provide: AssignmentService,
          useValue: mockAssignmentService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
    service = module.get<AssignmentService>(AssignmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAssignment', () => {
    it('should call createAssignment with correct DTO', async () => {
      const createDto: CreateAssignmentDto = {
        name: 'New Assignment',
        desc: 'New Description',
        deadline: new Date(),
      };
      const result = await controller.createAssignment(createDto);
      expect(result).toEqual(mockAssignment);
      expect(service.createAssignment).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAssignments', () => {
    it('should return paginated assignments', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const searchDto = { keyword: '' };
      const result = await controller.getAssignments(paginationDto, searchDto);
      expect(result).toEqual({
        data: [mockAssignment],
        page: 1,
        limit: 10,
        total: 1,
      });
      expect(service.getAssignments).toHaveBeenCalledWith(
        paginationDto,
        searchDto,
      );
    });
  });

  describe('findOneAssignment', () => {
    it('should return an assignment by ID', async () => {
      const result = await controller.findOneAssignment(1);
      expect(result).toEqual(mockAssignment);
      expect(service.findOneAssignment).toHaveBeenCalledWith(1);
    });
  });

  describe('updateAssignment', () => {
    it('should update the assignment by ID', async () => {
      const updateDto: UpdateAssigmentDto = {
        name: 'Updated Assignment',
        desc: 'Updated Description',
        deadline: new Date(),
      };
      const result = await controller.updateAssignment(1, updateDto);
      expect(result).toEqual(mockAssignment);
      expect(service.updateAssignment).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteAssignment', () => {
    it('should delete the assignment by ID', async () => {
      const result = await controller.deleteAssignment(1);
      expect(result).toEqual({
        message: `Assignment with ID 1 deleted successfully`,
      });
      expect(service.deleteAssignment).toHaveBeenCalledWith(1);
    });
  });
});
