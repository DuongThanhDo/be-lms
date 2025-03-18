import { IsNotEmpty, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @IsInt()
  chapterId: number;

  @IsNotEmpty()
  @IsUrl()
  video_url: string;

  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateLectureDto {
  @IsUrl()
  video_url?: string;

  @IsInt()
  order?: number;

  @IsString()
  description?: string;
}
