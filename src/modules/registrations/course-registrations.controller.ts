import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseRegistrationsService } from './course-registrations.service';
import { CreateCourseRegistrationDto } from './create-course-registration.dto';

@Controller('course-registrations')
export class CourseRegistrationsController {
  constructor(private readonly service: CourseRegistrationsService) {}

  @Post()
  create(@Body() dto: CreateCourseRegistrationDto) {
    return this.service.create(dto);
  }

  @Get('/student/:userId')
  findAllByStudent(@Param('userId') userId: string) {
    return this.service.findAllByStudent(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
