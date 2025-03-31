import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCourseDto,
  SearchCourseByTearch,
  UpdateCourseDto,
} from './courses.dto';
import { Course } from './courses.entity';
import { User } from '../users/user.entity';
import { MediaService } from '../medias/medias.service';
import { Category } from '../central_information/categories/category.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findAllByTeacher(dto: SearchCourseByTearch): Promise<any[]> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.image', 'image')
      .where('course.teacher_id = :teacherId', { teacherId: dto.teacherId })
      .orderBy('course.updated_at', 'DESC');

    if (dto.searchValue) {
      queryBuilder.andWhere(
        '(course.name LIKE :search OR course.description LIKE :search)',
        { search: `%${dto.searchValue}%` },
      );
    }

    if (dto.category) {
      queryBuilder.andWhere('course.category_id = :category', {
        category: dto.category,
      });
    }

    if (dto.type) {
      queryBuilder.andWhere('course.type = :type', { type: dto.type });
    }

    if (dto.status) {
      queryBuilder.andWhere('course.status = :status', { status: dto.status });
    }

    const courses = await queryBuilder.getMany();

    return courses.map((course) => ({
      id: course.id,
      teacherId: course.teacher?.id,
      name: course.name,
      description: course.description,
      category: course.category?.name,
      price: course.price,
      type: course.type,
      image: course.image,
      status: course.status,
      created_at: course.created_at,
      updated_at: course.updated_at,
    }));
  }
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['category', 'image'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async create(dto: CreateCourseDto): Promise<number> {
    const teacher = await this.userRepository.findOne({
      where: { id: dto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${dto.teacherId} not found`);
    }

    const newCourse = this.courseRepository.create({
      name: dto.name,
      type: dto.type,
      status: dto.status,
      teacher,
    });

    const course = await this.courseRepository.save(newCourse);
    return course.id;
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.category },
    });
    const course = await this.findOne(id);
    Object.assign(course, { ...dto, category });
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
      const imageId = course.image.id;
      course.image = null;
      await this.courseRepository.save(course);
      await this.mediaService.deleteFile(imageId);
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
