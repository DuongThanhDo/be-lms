import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { CourseStatus, CourseType } from 'src/common/constants/enum';
import { Chapter } from './chapters/chapters.entity';
import { Media } from '../medias/media.entity';
import { Category } from '../central_information/categories/category.entity';

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

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToOne(() => Category, (category) => category.course )
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'enum', enum: CourseType })
  type: CourseType;

  @OneToOne(() => Media, (media) => media.course)
  @JoinColumn({ name: 'image' })
  image: Media;

  @Column({ type: "enum", enum: CourseStatus, default: CourseStatus.DRAFT })
  status: CourseStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: false })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
