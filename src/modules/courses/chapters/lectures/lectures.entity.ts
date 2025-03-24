import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Chapter } from '../chapters.entity';
import { Media } from 'src/modules/medias/media.entity';

@Entity('lectures')
export class Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.lectures, { onDelete: 'CASCADE' })
  chapter: Chapter;

  @OneToOne(() => Media, (media) => media.lecture)
  @JoinColumn({ name: 'video_url' })
  video: Media;

  @Column({ type: 'int' })
  order: number;

  @Column('text')
  description: string;
}
