import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, LessThanOrEqual, Repository, Not, Or } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { Reservation } from './entity/reservation.entity';
import { MeetingRoom } from '../meeting-room/entity/meeting-room.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  // ── User CRUD ──────────────────────────────────────────────────────────────

  async create(dto: CreateUserDto): Promise<User> {
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['reservations', 'reservations.room'],
    });
  }

  async findOne(user_id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id },
      relations: ['reservations'],
    });
    if (!user) {
      throw new NotFoundException(`User #${user_id} not found`);
    }
    return user;
  }

  async update(user_id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(user_id);
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(user_id: number): Promise<void> {
    const result = await this.userRepository.delete({ user_id });
    if (!result.affected) {
      throw new NotFoundException(`User #${user_id} not found`);
    }
  }

  // ── Reservation CRUD ───────────────────────────────────────────────────────

  async createReservation(
    user_id: number,
    dto: CreateReservationDto,
  ): Promise<Reservation> {
    const user = await this.findOne(user_id);
    const isDuplicatedReservations = await this.reservationRepository.findOne({
      where: {
        room: { room_id: dto.room_id },
        end_time: MoreThanOrEqual(dto.start_time),
        start_time: LessThanOrEqual(dto.end_time),
        reservation_status: 'RESERVED',
      },
    });
    if (isDuplicatedReservations) {
      throw new BadRequestException(
        '선택하신 시간대에 이미 회의실이 예약되어 있습니다.',
      );
    }
    const reservation = this.reservationRepository.create({
      ...dto,
      user,
      room: { room_id: dto.room_id } as MeetingRoom,
    });
    return this.reservationRepository.save(reservation);
  }

  findAllReservations(user_id: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { user_id } },
      relations: ['user', 'room'],
    });
  }

  async findOneReservation(reservation_id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservation_id },
      relations: ['user', 'room'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation #${reservation_id} not found`);
    }
    return reservation;
  }

  async updateReservation(
    reservation_id: number,
    dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOneReservation(reservation_id);
    const isDuplicatedReservations = await this.reservationRepository.findOne({
      where: {
        reservation_id: Not(reservation.reservation_id),
        room: { room_id: reservation.room.room_id },
        end_time: MoreThanOrEqual(dto.start_time || reservation.start_time),
        start_time: LessThanOrEqual(dto.end_time || reservation.end_time),
        reservation_status: 'RESERVED',
      },
    });
    if (isDuplicatedReservations) {
      throw new BadRequestException(
        '선택하신 시간대에 이미 회의실이 예약되어 있습니다.',
      );
    }
    Object.assign(reservation, dto);
    return this.reservationRepository.save(reservation);
  }

  async removeReservation(reservation_id: number): Promise<void> {
    const result = await this.reservationRepository.delete({ reservation_id });
    if (!result.affected) {
      throw new NotFoundException(`Reservation #${reservation_id} not found`);
    }
  }

  @Cron('*/1 * * * *')
  async makeReservationCompleted() {
    return this.reservationRepository.update(
      {
        reservation_status: 'RESERVED',
        end_time: LessThanOrEqual(new Date()),
      },
      {
        reservation_status: 'COMPLETED',
      },
    );
  }
}
