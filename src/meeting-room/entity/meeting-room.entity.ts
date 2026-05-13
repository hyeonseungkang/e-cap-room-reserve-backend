import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RoomEquipment } from './room-equipment.entity';
import { Reservation } from '../../user/entity/reservation.entity';
import { Admin } from '../../admin/entity/admin.entity';

@Entity('meeting_rooms')
export class MeetingRoom {
  @PrimaryGeneratedColumn('increment')
  room_id: number;

  @Column({ length: 100 })
  room_name: string;

  @Column({ length: 100 })
  location: string;

  @Column()
  capacity: number;

  @Column({ length: 20, default: 'AVAILABLE' })
  room_status: string;

  // N:1 관계 (여러 회의실은 한 명의 관리자에 의해 관리될 수 있음)
  @ManyToOne(() => Admin, (admin) => admin.rooms, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  // 1:N 관계 (회의실 - 장비)
  @OneToMany(() => RoomEquipment, (equipment) => equipment.room)
  equipment: RoomEquipment[];

  // 1:N 관계 (회의실 - 예약)
  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
}
