import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from '../../user/entity/reservation.entity';

@Entity('PENALTY_HISTORY')
export class PenaltyHistory {
  @PrimaryGeneratedColumn('increment')
  penalty_history_id: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
