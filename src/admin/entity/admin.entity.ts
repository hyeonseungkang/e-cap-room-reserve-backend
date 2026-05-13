import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MeetingRoom } from '../../meeting-room/entity/meeting-room.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  admin_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @CreateDateColumn()
  created_at: Date;

  // 1:N 관계 (관리자는 여러 회의실을 관리할 수 있음)
  @OneToMany(() => MeetingRoom, (room) => room.admin)
  rooms: MeetingRoom[];
}
