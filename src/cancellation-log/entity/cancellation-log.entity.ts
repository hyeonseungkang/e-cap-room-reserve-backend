import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Reservation } from '../../user/entity/reservation.entity';

@Entity('CANCELLATION_LOGS')
export class CancellationLog {
  @PrimaryGeneratedColumn('increment')
  cancellation_id: number;

  @CreateDateColumn()
  cancelled_at: Date;

  @Column({ length: 255, nullable: true })
  cancel_reason: string;

  @Column({ type: 'int', default: 0 })
  is_late_cancel: number;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
