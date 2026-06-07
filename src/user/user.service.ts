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
import { PenaltyService } from 'src/penalty/penalty.service';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly penaltyService: PenaltyService,
    private readonly meetingRoomService: MeetingRoomService,
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
    const panaltyHistories =
      await this.penaltyService.findHistoriesByUser(user_id);
    for (const history of panaltyHistories) {
      if (history.end_date > new Date()) {
        throw new BadRequestException(
          '현재 예약이 제한된 상태입니다. 자세한 사항은 패널티 내역을 확인해주세요.',
        );
      }
    }
    const meetingRoom = await this.meetingRoomService.findOne(dto.room_id);
    if (
      Number(dto.participant_count || 0) < 1 ||
      meetingRoom.capacity < Number(dto.participant_count || 999)
    ) {
      throw new BadRequestException(
        '참여 인원 수가 회의실의 수용 인원 범위를 벗어났습니다.',
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
    if (reservation.reservation_status !== 'RESERVED') {
      throw new BadRequestException(
        '진행 중인 예약 외에는 수정할 수 없습니다.',
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

  @Cron('0 * * * * *')
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
