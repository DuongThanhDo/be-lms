import { IsInt, IsOptional } from 'class-validator';

export class CreateCourseRegistrationDto {
  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;
}
