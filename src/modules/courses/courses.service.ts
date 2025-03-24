import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto } from './courses.dto';
import { Course } from './courses.entity';
import { User } from '../users/user.entity';
import { MediaService } from '../medias/medias.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mediaService: MediaService
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
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
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${dto.teacherId} not found`);
    }

    const newCourse = this.courseRepository.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      price: dto.price,
      type: dto.type,
      teacher,
    });

    return this.courseRepository.save(newCourse);
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, dto);
    return this.courseRepository.save(course);
  }

  async updateCourseImage(id: number, file: any): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['image'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.image) {
      await this.mediaService.deleteFile(course.image.id);
    }

    const media = await this.mediaService.uploadFile(file);
    course.image = media;
    return this.courseRepository.save(course);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return true;
  }
}
