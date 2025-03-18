import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './courses.dto';
import { Course } from './courses.entity';

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

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.coursesService.remove(id);
  }
}
