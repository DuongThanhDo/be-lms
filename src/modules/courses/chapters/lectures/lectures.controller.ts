import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureDto, UpdateLectureDto } from './lectures.dto';
import { Lecture } from './lectures.entity';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Get()
  async findAll(@Query('chapterId') chapterId: number): Promise<Lecture[]> {
    return await this.lecturesService.findAll(chapterId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Lecture> {
    return await this.lecturesService.findOne(id);
  }

  @Post()
  async create(@Body() createLectureDto: CreateLectureDto): Promise<Lecture> {
    return await this.lecturesService.create(createLectureDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateLectureDto: UpdateLectureDto): Promise<Lecture> {
    return await this.lecturesService.update(id, updateLectureDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.lecturesService.remove(id);
  }
}
