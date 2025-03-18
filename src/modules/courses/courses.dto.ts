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

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsEnum(CourseType)
  type: CourseType;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}