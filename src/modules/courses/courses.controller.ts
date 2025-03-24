import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './courses.dto';
import { Course } from './courses.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {    
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Put('/upload/:id')
  @UseInterceptors(FileInterceptor('file')) 
  updateCourseImage(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<Course> {
    return this.coursesService.updateCourseImage(parseInt(id), file);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.coursesService.remove(id);
  }
}
