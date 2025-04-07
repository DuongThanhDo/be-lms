import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, IsPositive, IsOptional, Min, IsInt } from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}

export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
