import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from './dto/create-note-dto';
import { UpdateNoteDto } from './dto/update-note-dto';

@Injectable()
export class NoteService {
    constructor(private readonly prismaService: PrismaService) {}

    async allNotes() {
       
        const notes = await this.prismaService.note.findMany();
        if(!notes) {
            throw new NotFoundException("No Notes Found");
        }
        return notes;
    }

    async allStudentNotes(studentId: number) {
        const allMyStudentNotes = await this.prismaService.note.findMany({
            where: {
                studentId
            }
        });

        if(!allMyStudentNotes) {
            throw new NotFoundException("Student does not create any notes")
        }

        return allMyStudentNotes
    }
    async oneNote(id: number) {
        const note = await this.prismaService.note.findUnique({
            where: { id },
        });
        if (!note) {
            throw new NotFoundException(`Note with ID ${id} not found`);
        }
        return note;
    }

    async createNote(noteDto: CreateNoteDto) {
        const newNote = await this.prismaService.note.create({
            data: {
               ...noteDto
            },
        });

        const checkStudent = await this.prismaService.student.findFirst({
            where: {
                id: noteDto.studentId
            }
        });

        if(!checkStudent) {
            throw new BadRequestException("Student does not exists")
        }

        if(!newNote) {
            throw new BadRequestException("Failed to create note")
        }

        return newNote;
    }

    // Update an existing note by its ID
    async updateNote(id: number, updateDto: UpdateNoteDto) {
        /* return this.prismaService.note.update({
            where: { id },
            data: {
                name,
                content,
            },
        }); */

        const findOneNote = await this.oneNote(id);

        const updateNote = await this.prismaService.note.update({
            where: {
                id: findOneNote.id
            },

            data: {
                ...updateDto
            }
        });

        if(!updateNote) {
            throw new ForbiddenException("Failed to update note");
        }

        return updateNote
    }

    async deleteNote(id: number) {

        const oneNoteCheck = await this.oneNote(id);

        const deleteSpecificNote = await this.prismaService.note.delete({
            where: {
                id: oneNoteCheck.id
            }
        });

        if(!deleteSpecificNote) {
            throw new BadRequestException("Failed to delete note");
        }
    }

    // Paginated fetching of student notes
    async paginatedStudentNotes(studentId: number, page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        const [notes, totalCount] = await Promise.all([
            this.prismaService.note.findMany({
                where: { studentId },
                skip,
                take: pageSize,
            }),
            this.prismaService.note.count({
                where: { studentId },
            }),
        ]);

        return {
            notes,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
        };
    }

    async searchStudentNote(studentId: number, searchTerm: string) {
        return this.prismaService.note.findMany({
            where: {
                studentId,
                OR: [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { content: { contains: searchTerm, mode: "insensitive" } },
                ],
            },
        });
    }
}