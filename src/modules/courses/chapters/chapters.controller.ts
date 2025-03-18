import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto, UpdateChapterDto } from './chapters.dto';
import { Chapter } from './chapters.entity';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  async getChaptersWithContent(@Query('content') courseId: number): Promise<any[]> {
    if (!courseId) {
      throw new HttpException(
        'Vui lòng cung cấp courseId để lấy các chapter!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chaptersService.getChaptersWithContent(courseId);
  }

  @Get()
  async findAll(@Query('courseId') courseId: number): Promise<Chapter[]> {
    if (!courseId) {
      throw new HttpException(
        'Vui lòng cung cấp courseId để lấy các chapter!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chaptersService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.chaptersService.findOne(id);
  }

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(id, updateChapterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.chaptersService.remove(id);
  }
}
