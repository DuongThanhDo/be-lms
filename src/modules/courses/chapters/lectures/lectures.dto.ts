import { IsNotEmpty, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @IsInt()
  chapterId: number;

  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateLectureDto {

  @IsInt()
  order?: number;

  @IsString()
  description?: string;
}
