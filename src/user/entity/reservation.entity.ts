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

@Entity('reservations')
@Check(`"end_time" > "start_time"`) // SQL의 CHECK 제약 조건 반영
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  reservation_id: number;

  @Column({ type: 'datetime' })
  start_time: Date;

  @Column({ type: 'datetime' })
  end_time: Date;

  @Column({ length: 255, nullable: true })
  purpose: string;

  @Column({ length: 20, default: 'RESERVED' })
  reservation_status: string;

  @CreateDateColumn()
  created_at: Date;

  // N:1 관계 (여러 예약은 한 명의 사용자에게 속함)
  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // N:1 관계 (여러 예약은 하나의 회의실에 속함)
  @ManyToOne(() => MeetingRoom, (room) => room.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: MeetingRoom;
}
