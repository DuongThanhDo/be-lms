import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Course } from '../courses/courses.entity';
import { Lecture } from '../courses/chapters/lectures/lectures.entity';
import { UserProfile } from '../users/profiles/profiles.entity';

@Entity({ name: 'medias' })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column({ nullable: true })
  file_folder: string;

  @Column()
  file_url: string;

  @Column({ nullable: true })
  file_type: string;

  @Column({ nullable: true })
  cloud_id: string;

  @Column({ nullable: true })
  service: string;

  @CreateDateColumn()
  created_at: Date;

  // ---------------------
  @OneToOne(() => Course, (m) => m.image, { cascade: true })
  course: Course

  @OneToOne(() => Lecture, (m) => m.video, { cascade: true })
  lecture: Lecture

  @OneToOne(() => UserProfile, (m) => m.avatar, { cascade: true })
  avatar: UserProfile
}
