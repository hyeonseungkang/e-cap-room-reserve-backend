import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../../admin/entity/admin.entity';

@Entity('ANSWERS')
export class Answer {
  @PrimaryGeneratedColumn('increment')
  answer_id: number;

  @Column({ type: 'clob' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Admin, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
