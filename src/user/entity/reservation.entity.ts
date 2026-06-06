import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from './user.entity';
import { MeetingRoom } from '../../meeting-room/entity/meeting-room.entity';

@Entity('RESERVATIONS')
@Check(`"end_time" > "start_time"`)
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  reservation_id: number;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ nullable: true })
  participant_count: number;

  @Column({ length: 255, nullable: true })
  purpose: string;

  @Column({ length: 20, default: 'RESERVED' })
  reservation_status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => MeetingRoom, (room) => room.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: MeetingRoom;
}
