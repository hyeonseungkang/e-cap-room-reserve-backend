import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancellationLog } from './entity/cancellation-log.entity';
import { CreateCancellationLogDto } from './dto/create-cancellation-log.dto';
import { UpdateCancellationLogDto } from './dto/update-cancellation-log.dto';
import { Reservation } from '../user/entity/reservation.entity';

@Injectable()
export class CancellationLogService {
  constructor(
    @InjectRepository(CancellationLog)
    private readonly cancellationLogRepository: Repository<CancellationLog>,
  ) {}

  create(dto: CreateCancellationLogDto): Promise<CancellationLog> {
    const log = this.cancellationLogRepository.create({
      ...dto,
      reservation: { reservation_id: dto.reservation_id } as Reservation,
    });
    return this.cancellationLogRepository.save(log);
  }

  findAll(): Promise<CancellationLog[]> {
    return this.cancellationLogRepository.find({ relations: ['reservation'] });
  }

  async findOne(cancellation_id: number): Promise<CancellationLog> {
    const log = await this.cancellationLogRepository.findOne({
      where: { cancellation_id },
      relations: ['reservation'],
    });
    if (!log) {
      throw new NotFoundException(
        `CancellationLog #${cancellation_id} not found`,
      );
    }
    return log;
  }

  findByReservation(reservation_id: number): Promise<CancellationLog[]> {
    return this.cancellationLogRepository.find({
      where: { reservation: { reservation_id } },
      relations: ['reservation'],
    });
  }

  async update(
    cancellation_id: number,
    dto: UpdateCancellationLogDto,
  ): Promise<CancellationLog> {
    const log = await this.findOne(cancellation_id);
    Object.assign(log, dto);
    return this.cancellationLogRepository.save(log);
  }

  async remove(cancellation_id: number): Promise<void> {
    const result = await this.cancellationLogRepository.delete({
      cancellation_id,
    });
    if (!result.affected) {
      throw new NotFoundException(
        `CancellationLog #${cancellation_id} not found`,
      );
    }
  }
}
