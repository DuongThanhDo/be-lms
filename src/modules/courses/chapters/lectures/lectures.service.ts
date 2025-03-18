import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLectureDto, UpdateLectureDto } from './lectures.dto';
import { Lecture } from './lectures.entity';
import { Chapter } from '../chapters.entity';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
  ) {}

  async findAll(chapterId: number): Promise<Lecture[]> {
    return await this.lectureRepository.find({
      where: { chapter: { id: chapterId } },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({ where: { id } });
    if (!lecture) throw new NotFoundException(`Lecture with ID ${id} not found`);
    return lecture;
  }

  async create(dto: CreateLectureDto): Promise<Lecture> {
    const chapter = await this.chapterRepository.findOne({ where: { id: dto.chapterId } });
    if (!chapter) throw new NotFoundException('Chapter không tồn tại');

    const newLecture = this.lectureRepository.create({
      ...dto,
      chapter,
    });
    return await this.lectureRepository.save(newLecture);
  }

  async update(id: number, dto: UpdateLectureDto): Promise<Lecture> {
    const lecture = await this.findOne(id);
    Object.assign(lecture, dto);
    return await this.lectureRepository.save(lecture);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lectureRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lecture with ID ${id} not found`);
    }
  }
}
