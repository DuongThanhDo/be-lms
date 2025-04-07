import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { CourseStatus, CourseType } from 'src/common/constants/enum';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(CourseType)
  type: CourseType;

  @IsOptional()
  @IsEnum(CourseStatus)
  status: CourseStatus;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  category?: number;

  @IsOptional()
  price?: number;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}

export class SearchCourseByTearch {
  @IsNotEmpty()
  @IsString()
  teacherId: string;

  @IsOptional()
  @IsString()
  searchValue?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}
