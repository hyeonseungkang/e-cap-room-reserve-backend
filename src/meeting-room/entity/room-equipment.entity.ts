import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MeetingRoom } from './meeting-room.entity';

@Entity('room_equipment')
export class RoomEquipment {
  @PrimaryGeneratedColumn('increment')
  equipment_id: number;

  @Column({ length: 100 })
  equipment_name: string;

  @Column({ default: 1 })
  quantity: number;

  // N:1 관계 (여러 장비는 하나의 회의실에 속함)
  @ManyToOne(() => MeetingRoom, (room) => room.equipment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: MeetingRoom;
}
