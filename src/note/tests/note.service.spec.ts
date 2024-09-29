import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from '../dto/create-note-dto';
import { UpdateNoteDto } from '../dto/update-note-dto';
import { NoteService } from '../note.service';

describe('NoteService', () => {
  let service: NoteService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: PrismaService,
          useValue: {
            note: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            student: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('allNotes', () => {
    it('should return all notes', async () => {
      const notes = [
        { id: 1, name: 'Test Note', content: 'Content', studentId: 1 },
      ];
      jest.spyOn(prismaService.note, 'findMany').mockResolvedValue(notes);

      const result = await service.allNotes();
      expect(result).toEqual(notes);
    });

    it('should throw NotFoundException if no notes are found', async () => {
      jest.spyOn(prismaService.note, 'findMany').mockResolvedValue([]);
      await expect(service.allNotes()).rejects.toThrow(NotFoundException);
    });
  });

  describe('allStudentNotes', () => {
    it('should return all notes for a specific student', async () => {
      const studentId = 1;
      const notes = [{ id: 1, name: 'Note 1', content: 'Content', studentId }];
      jest.spyOn(prismaService.note, 'findMany').mockResolvedValue(notes);

      const result = await service.allStudentNotes(studentId);
      expect(result).toEqual(notes);
    });

    it('should throw NotFoundException if student has no notes', async () => {
      const studentId = 1;
      jest.spyOn(prismaService.note, 'findMany').mockResolvedValue([]);
      await expect(service.allStudentNotes(studentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('oneNote', () => {
    it('should return one note by id', async () => {
      const note = {
        id: 1,
        name: 'Test Note',
        content: 'Content',
        studentId: 1,
      };
      jest.spyOn(prismaService.note, 'findUnique').mockResolvedValue(note);

      const result = await service.oneNote(1);
      expect(result).toEqual(note);
    });

    it('should throw NotFoundException if note is not found', async () => {
      jest.spyOn(prismaService.note, 'findUnique').mockResolvedValue(null);
      await expect(service.oneNote(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        name: 'New Note',
        content: 'Content',
        studentId: 1,
      };
      const note = { id: 1, ...createNoteDto };
      jest.spyOn(prismaService.note, 'create').mockResolvedValue(note);
      jest
        .spyOn(prismaService.student, 'findFirst')
        .mockResolvedValue({ id: 1 });

      const result = await service.createNote(createNoteDto);
      expect(result).toEqual(note);
    });

    it('should throw BadRequestException if student does not exist', async () => {
      const createNoteDto: CreateNoteDto = {
        name: 'New Note',
        content: 'Content',
        studentId: 999,
      };
      jest.spyOn(prismaService.student, 'findFirst').mockResolvedValue(null);

      await expect(service.createNote(createNoteDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
        content: 'Updated Content',
      };
      const note = {
        id: 1,
        name: 'Test Note',
        content: 'Content',
        studentId: 1,
      };
      const updatedNote = { ...note, ...updateNoteDto };

      jest.spyOn(service, 'oneNote').mockResolvedValue(note);
      jest.spyOn(prismaService.note, 'update').mockResolvedValue(updatedNote);

      const result = await service.updateNote(1, updateNoteDto);
      expect(result).toEqual(updatedNote);
    });

    it('should throw ForbiddenException if update fails', async () => {
      const updateNoteDto: UpdateNoteDto = {
        name: 'Updated Note',
        content: 'Updated Content',
      };
      const note = {
        id: 1,
        name: 'Test Note',
        content: 'Content',
        studentId: 1,
      };

      jest.spyOn(service, 'oneNote').mockResolvedValue(note);
      jest.spyOn(prismaService.note, 'update').mockResolvedValue(null);

      await expect(service.updateNote(1, updateNoteDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const note = {
        id: 1,
        name: 'Test Note',
        content: 'Content',
        studentId: 1,
      };

      jest.spyOn(service, 'oneNote').mockResolvedValue(note);
      jest.spyOn(prismaService.note, 'delete').mockResolvedValue(note);

      await service.deleteNote(1);
      expect(prismaService.note.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException if delete fails', async () => {
      const note = {
        id: 1,
        name: 'Test Note',
        content: 'Content',
        studentId: 1,
      };

      jest.spyOn(service, 'oneNote').mockResolvedValue(note);
      jest.spyOn(prismaService.note, 'delete').mockResolvedValue(null);

      await expect(service.deleteNote(1)).rejects.toThrow(BadRequestException);
    });
  });
});
