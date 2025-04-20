import { IsString, IsOptional } from 'class-validator';

export class QuestionDto {
  @IsString()
  id: string;
  
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  results: any;

  @IsOptional()
  @IsString()
  explain: string;
}
