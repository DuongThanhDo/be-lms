import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Course } from '../courses.entity';
import { Lecture } from './lectures/lectures.entity';


@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.chapters, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'int' })
  order: number;

  @OneToMany(() => Lecture, (lecture) => lecture.chapter, { cascade: true })
  lectures: Lecture[];
}
