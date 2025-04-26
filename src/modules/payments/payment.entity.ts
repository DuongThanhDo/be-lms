import { StatusPayment } from 'src/common/constants/enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  course_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: StatusPayment,
    default: 'pending',
  })
  status: StatusPayment;

  @Column()
  vnp_txn_ref: string;

  @Column({ nullable: true })
  vnp_response_code: string;

  @Column({ nullable: true })
  vnp_secure_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
