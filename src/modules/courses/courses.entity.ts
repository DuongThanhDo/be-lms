import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { CourseType } from 'src/common/constants/enum';
import { Chapter } from './chapters/chapters.entity';
import { Media } from '../medias/media.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Chapter, (chapter) => chapter.course, { cascade: true })
  chapters: Chapter[];

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ length: 255 })
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: CourseType })
  type: CourseType;

  @OneToOne(() => Media, (media) => media.course)
  @JoinColumn({ name: 'image' })
  image: Media;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: false })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
