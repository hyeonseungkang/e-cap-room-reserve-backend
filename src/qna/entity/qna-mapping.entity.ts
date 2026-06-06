import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity('QNA_MAPPINGS')
export class QnaMapping {
  @PrimaryGeneratedColumn('increment')
  mapping_id: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToOne(() => Answer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'answer_id' })
  answer: Answer;
}
