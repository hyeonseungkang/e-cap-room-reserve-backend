import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Reservation } from '../../user/entity/reservation.entity';

@Entity('USAGE_LOGS')
export class UsageLog {
  @PrimaryGeneratedColumn('increment')
  usage_id: number;

  @Column({ type: 'timestamp', nullable: true })
  check_in_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out_time: Date;

  @Column({ length: 20, nullable: true })
  usage_status: string;

  @OneToOne(() => Reservation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;
}
