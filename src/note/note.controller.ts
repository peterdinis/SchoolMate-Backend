import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note-dto';
import { UpdateNoteDto } from './dto/update-note-dto';
import { PaginationNoteDto } from './dto/pagination-note.dto';
import { SearchNoteDto } from './dto/search-note.dto';

@ApiTags('Notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All notes fetched successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No Notes Found' })
  async allNotes() {
    return this.noteService.allNotes();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Fetch all notes by a specific student' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student notes fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No notes found for this student',
  })
  async allStudentNotes(@Param('studentId') studentId: number) {
    return this.noteService.allStudentNotes(studentId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Fetch a single note by its ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note fetched successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Note not found' })
  async oneNote(@Param('id') id: number) {
    return this.noteService.oneNote(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Note created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create note',
  })
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.createNote(createNoteDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an existing note by its ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Failed to update note',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Note not found' })
  async updateNote(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.updateNote(id, updateNoteDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note by its ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Note deleted successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Note not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to delete note',
  })
  async deleteNote(@Param('id') id: number) {
    return this.noteService.deleteNote(id);
  }

  @Get('student/:studentId/paginated')
  @ApiOperation({ summary: 'Fetch paginated student notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated notes fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No notes found for this student',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
    required: true,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: 'Number of notes per page',
    required: true,
  })
  async paginatedStudentNotes(
    @Param('studentId') studentId: number,
    @Query() paginationDto: PaginationNoteDto,
  ) {
    return this.noteService.paginatedStudentNotes(paginationDto);
  }

  @Get('student/:studentId/search')
  @ApiOperation({ summary: 'Search student notes by name or content' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notes found successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No notes found matching search criteria',
  })
  @ApiQuery({
    name: 'searchTerm',
    type: String,
    description: 'Search term (optional)',
    required: false,
  })
  async searchStudentNote(
    @Param('studentId') studentId: number,
    @Query() searchDto: SearchNoteDto,
  ) {
    return this.noteService.searchStudentNote(searchDto);
  }
}
