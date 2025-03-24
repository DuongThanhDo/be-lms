import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CourseType } from 'src/common/constants/enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsEnum(CourseType)
  type: CourseType;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}