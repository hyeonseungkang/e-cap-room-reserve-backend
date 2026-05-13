import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 20, default: 'USER' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  // 1:N 관계 (사용자는 여러 예약을 가질 수 있음)
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
