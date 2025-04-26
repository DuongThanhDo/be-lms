import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateLessonProgressDto, UpdateLessonProgressDto } from './lesson-progress.dto';
import { LessonProgressesService } from './lesson-progress.service';

@Controller('lesson-progresses')
export class LessonProgressesController {
  constructor(private readonly lessonProgressesService: LessonProgressesService) {}

  @Post()
  create(@Body() dto: CreateLessonProgressDto) {
    return this.lessonProgressesService.create(dto);
  }

  @Get()
  findAll() {
    return this.lessonProgressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonProgressesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonProgressDto) {
    return this.lessonProgressesService.updateStatus(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonProgressesService.remove(+id);
  }
}
