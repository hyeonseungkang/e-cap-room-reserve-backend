import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('QUESTIONS')
export class Question {
  @PrimaryGeneratedColumn('increment')
  question_id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'clob' })
  content: string;

  @Column({ length: 20, default: 'PENDING' })
  question_status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
