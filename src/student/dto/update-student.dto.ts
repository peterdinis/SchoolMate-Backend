import { PartialType } from "@nestjs/swagger";
import { RegisterStudentDto } from "./register-student.dto";

export class UpdateStudentDto extends PartialType(RegisterStudentDto) {}