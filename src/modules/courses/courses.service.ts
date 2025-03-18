import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto } from './courses.dto';
import { Course } from './courses.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    const teacher = await this.userRepository.findOne({ where: { id: dto.teacherId } });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${dto.teacherId} not found`);
  
    const newCourse = this.courseRepository.create({
      ...dto,
      teacher,
    });
  
    return await this.courseRepository.save(newCourse);
  }
  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, dto);
    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<boolean | any> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return true;
  }
}
