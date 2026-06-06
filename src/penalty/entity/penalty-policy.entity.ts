import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('PENALTY_POLICIES')
export class PenaltyPolicy {
  @PrimaryGeneratedColumn('increment')
  penalty_policy_id: number;

  @Column({ length: 50 })
  penalty_type: string;

  @Column({ length: 255, nullable: true })
  penalty_reason: string;

  @Column({ nullable: true })
  restriction_days: number;

  @CreateDateColumn()
  created_at: Date;
}
