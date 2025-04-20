import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapters.entity';
import { CreateChapterDto, UpdateChapterDto } from './chapters.dto';
import { Course } from '../courses.entity';
import { Lecture } from './lectures/lectures.entity';
import { QuizSQL } from './quizSQL/quizSQL.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(QuizSQL)
    private quizRepository: Repository<QuizSQL>,
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
    if (!chapter)
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    return chapter;
  }

  async create(dto: CreateChapterDto): Promise<Chapter> {
    const course = await this.courseRepository.findOne({
      where: { id: Number(dto.courseId) },
    });
    if (!course)
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);

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

  async getTotalDurationForChapter(chapterId: number): Promise<number> {
    const [lectures, quizzes] = await Promise.all([
      // const [lectures, exercises, quizzes] = await Promise.all([
      this.lectureRepository.find({ where: { chapter: { id: chapterId } } }),
      // this.codeExerciseRepository.find({ where: { chapter: { id: chapterId } } }),
      this.quizRepository.find({ where: { chapter: { id: chapterId } } }),
    ]);

    const totalLectureDuration = lectures.reduce(
      (sum, l) => sum + (l.duration || 0),
      0,
    );
    // const totalExerciseDuration = exercises.reduce((sum, e) => sum + (e.duration || 0), 0);
    const totalQuizDuration = quizzes.reduce((sum, q) => sum + 60, 0);

    return totalLectureDuration + totalQuizDuration;
    // return totalLectureDuration + totalExerciseDuration + totalQuizDuration;
  }

  async getChaptersWithContent(courseId: number): Promise<any[]> {
    const chapters = await this.chapterRepository.find({
      where: { course: { id: courseId } },
      relations: ['lectures', 'lectures.video', 'quizzes'],
      //   relations: ['lectures', 'quizzes'],
      order: { order: 'ASC' },
    });

    const chaptersWithContent = await Promise.all(
      chapters.map(async (chapter) => {
        const lectures = chapter.lectures
          ? chapter.lectures.map((lecture) => ({
              type: 'lecture',
              id: lecture.id,
              title: lecture.title,
              video: lecture.video ?? null,
              order: lecture.order,
              description: lecture.description,
              duration: lecture.duration,
            }))
          : [];

        const quizzes = chapter.quizzes
          ? chapter.quizzes.map((quiz) => ({
              type: 'quiz',
              id: quiz.id,
              title: quiz.name,
              order: quiz.order,
            }))
          : [];

        const durationChapter = await this.getTotalDurationForChapter(
          chapter.id,
        );

        return {
          id: chapter.id,
          title: chapter.title,
          duration: durationChapter,
          items: [...lectures, ...quizzes].sort((a, b) => a.order - b.order),
          // items: lectures.sort((a, b) => a.order - b.order),
        };
      }),
    );

    return chaptersWithContent;
  }
}
