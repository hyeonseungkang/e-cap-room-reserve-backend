import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MeetingRoom } from '../../meeting-room/entity/meeting-room.entity';

@Entity('ADMINS')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  admin_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ type: 'int', default: 1 })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => MeetingRoom, (room) => room.admin)
  rooms: MeetingRoom[];
}
