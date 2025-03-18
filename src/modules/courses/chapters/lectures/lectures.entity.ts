import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Chapter } from '../chapters.entity';

@Entity('lectures')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.lectures, { onDelete: 'CASCADE' })
  chapter: Chapter;

  @Column({ length: 255 })
  video_url: string;

  @Column({ type: 'int' })
  order: number;

  @Column('text')
  description: string;
}
