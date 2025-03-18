import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapters.entity';
import { CreateChapterDto, UpdateChapterDto } from './chapters.dto';
import { Course } from '../courses.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(courseId: number): Promise<Chapter[]> {
    return await this.chapterRepository.find({
      where: { course: { id: courseId } },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!chapter) throw new NotFoundException(`Chapter with ID ${id} not found`);
    return chapter;
  }

  async create(dto: CreateChapterDto): Promise<Chapter> {
    const course = await this.courseRepository.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
  
    const maxOrder = await this.chapterRepository
      .createQueryBuilder('chapter')
      .select('MAX(chapter.order)', 'max')
      .where('chapter.course = :courseId', { courseId: dto.courseId })
      .getRawOne();
  
    const newOrder = (maxOrder?.max ?? 0) + 1;
  
    const newChapter = this.chapterRepository.create({
      ...dto,
      course,
      order: newOrder,
    });
  
    return await this.chapterRepository.save(newChapter);
  }

  async update(id: number, dto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    Object.assign(chapter, dto);
    return await this.chapterRepository.save(chapter);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chapterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
  }

  async getChaptersWithContent(courseId: number): Promise<any[]> {
    const chapters = await this.chapterRepository.find({
      where: { course: { id: courseId } },
      relations: ['lectures'],
    //   relations: ['lectures', 'quizzes'],
      order: { order: 'ASC' },
    });
  
    return chapters.map((chapter) => {
      const lectures = chapter.lectures ? chapter.lectures.map((lecture) => ({
        type: 'lecture',
        id: lecture.id,
        video_url: lecture.video_url,
        order: lecture.order,
        description: lecture.description,
      })) : [];
  
    //   const quizzes = chapter.quizzes ? chapter.quizzes.map((quiz) => ({
    //     type: 'quiz',
    //     id: quiz.id,
    //     title: quiz.title,
    //     order: quiz.order,
    //   })) : [];
  
      return {
        chapter: chapter.title,
        // content: [...lectures, ...quizzes].sort((a, b) => a.order - b.order),
        content: [...lectures].sort((a, b) => a.order - b.order),
      };
    });
  }
  
}
