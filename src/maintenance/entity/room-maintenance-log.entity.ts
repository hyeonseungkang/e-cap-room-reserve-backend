import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MeetingRoom } from '../../meeting-room/entity/meeting-room.entity';
import { Admin } from '../../admin/entity/admin.entity';

@Entity('ROOM_MAINTENANCE_LOGS')
export class RoomMaintenanceLog {
  @PrimaryGeneratedColumn('increment')
  maintenance_id: number;

  @Column({ length: 50, nullable: true })
  maintenance_type: string;

  @Column({ length: 20, nullable: true })
  maintenance_status: string;

  @ManyToOne(() => MeetingRoom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: MeetingRoom;

  @ManyToOne(() => Admin, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin | null;
}
