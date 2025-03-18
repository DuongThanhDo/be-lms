import { UserRole } from 'src/common/constants/enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { UserProfile } from './profiles/profiles.entity';
import { Profession } from './professions/professions.entity';
import { Course } from '../courses/courses.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profiles: UserProfile;
  
  @OneToOne(() => Profession, (professions) => professions.user)
  professions: Profession;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];
}