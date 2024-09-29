import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoteDto } from '../dto/create-note-dto';
import { PaginationNoteDto } from '../dto/pagination-note.dto';
import { SearchNoteDto } from '../dto/search-note.dto';
import { UpdateNoteDto } from '../dto/update-note-dto';
import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';

describe('NoteController', () => {
  let controller: NoteController;
  let noteService: NoteService;

  const mockNoteService = {
    allNotes: jest.fn(),
    allStudentNotes: jest.fn(),
    oneNote: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    paginatedStudentNotes: jest.fn(),
    searchStudentNote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        {
          provide: NoteService,
          useValue: mockNoteService,
        },
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
    noteService = module.get<NoteService>(NoteService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('allNotes', () => {
    it('should return all notes', async () => {
      const result = [{ id: 1, name: 'Test Note', content: 'Content' }];
      jest.spyOn(noteService, 'allNotes').mockResolvedValue(result);

      expect(await controller.allNotes()).toBe(result);
      expect(noteService.allNotes).toHaveBeenCalled();
    });
  });

  describe('allStudentNotes', () => {
    it('should return all notes by a student', async () => {
      const studentId = 1;
      const result = [{ id: 1, name: 'Test Note', content: 'Content' }];
      jest.spyOn(noteService, 'allStudentNotes').mockResolvedValue(result);

      expect(await controller.allStudentNotes(studentId)).toBe(result);
      expect(noteService.allStudentNotes).toHaveBeenCalledWith(studentId);
    });
  });

  describe('oneNote', () => {
    it('should return a single note by id', async () => {
      const id = 1;
      const result = { id, name: 'Test Note', content: 'Content' };
      jest.spyOn(noteService, 'oneNote').mockResolvedValue(result);

      expect(await controller.oneNote(id)).toBe(result);
      expect(noteService.oneNote).toHaveBeenCalledWith(id);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = { name: 'New Note', content: 'Content', studentId: 1 };
      const result = { id: 1, ...createNoteDto };
      jest.spyOn(noteService, 'createNote').mockResolvedValue(result);

      expect(await controller.createNote(createNoteDto)).toBe(result);
      expect(noteService.createNote).toHaveBeenCalledWith(createNoteDto);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note by id', async () => {
      const id = 1;
      const updateNoteDto: UpdateNoteDto = { name: 'Updated Note', content: 'Updated Content' };
      const result = { id, ...updateNoteDto };
      jest.spyOn(noteService, 'updateNote').mockResolvedValue(result);

      expect(await controller.updateNote(id, updateNoteDto)).toBe(result);
      expect(noteService.updateNote).toHaveBeenCalledWith(id, updateNoteDto);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note by id', async () => {
      const id = 1;
      jest.spyOn(noteService, 'deleteNote').mockResolvedValue(null);

      expect(await controller.deleteNote(id)).toBe(null);
      expect(noteService.deleteNote).toHaveBeenCalledWith(id);
    });
  });

  describe('paginatedStudentNotes', () => {
    it('should return paginated notes for a student', async () => {
      const studentId = 1;
      const paginationDto: PaginationNoteDto = { page: 1, pageSize: 5 };
      const result = [{ id: 1, name: 'Test Note', content: 'Content' }];
      jest.spyOn(noteService, 'paginatedStudentNotes').mockResolvedValue(result);

      expect(await controller.paginatedStudentNotes(studentId, paginationDto)).toBe(result);
      expect(noteService.paginatedStudentNotes).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('searchStudentNote', () => {
    it('should search notes for a student by search term', async () => {
      const studentId = 1;
      const searchDto: SearchNoteDto = { searchTerm: 'Test' };
      const result = [{ id: 1, name: 'Test Note', content: 'Content' }];
      jest.spyOn(noteService, 'searchStudentNote').mockResolvedValue(result);

      expect(await controller.searchStudentNote(studentId, searchDto)).toBe(result);
      expect(noteService.searchStudentNote).toHaveBeenCalledWith(searchDto);
    });
  });
});