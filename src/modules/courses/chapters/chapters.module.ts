import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { Chapter } from './chapters.entity';
import { Course } from '../courses.entity';
import { Lecture } from './lectures/lectures.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Course, Lecture])],
  providers: [ChaptersService],
  controllers: [ChaptersController],
})
export class ChaptersModule {}
