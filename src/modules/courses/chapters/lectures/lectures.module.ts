import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { Lecture } from './lectures.entity';
import { Chapter } from '../chapters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, Chapter])],
  providers: [LecturesService],
  controllers: [LecturesController],
})
export class LecturesModule {}
