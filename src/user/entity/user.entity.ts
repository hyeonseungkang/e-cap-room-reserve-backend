import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 20, default: 'USER' })
  role: string;

  @Column({ type: 'int', default: 1 })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
