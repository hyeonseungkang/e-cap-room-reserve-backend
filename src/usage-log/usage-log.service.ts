import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsageLog } from './entity/usage-log.entity';
import { CreateUsageLogDto } from './dto/create-usage-log.dto';
import { UpdateUsageLogDto } from './dto/update-usage-log.dto';
import { Reservation } from '../user/entity/reservation.entity';

@Injectable()
export class UsageLogService {
  constructor(
    @InjectRepository(UsageLog)
    private readonly usageLogRepository: Repository<UsageLog>,
  ) {}

  create(dto: CreateUsageLogDto): Promise<UsageLog> {
    const log = this.usageLogRepository.create({
      ...dto,
      reservation: { reservation_id: dto.reservation_id } as Reservation,
    });
    return this.usageLogRepository.save(log);
  }

  findAll(): Promise<UsageLog[]> {
    return this.usageLogRepository.find({ relations: ['reservation'] });
  }

  async findOne(usage_id: number): Promise<UsageLog> {
    const log = await this.usageLogRepository.findOne({
      where: { usage_id },
      relations: ['reservation'],
    });
    if (!log) {
      throw new NotFoundException(`UsageLog #${usage_id} not found`);
    }
    return log;
  }

  async findByReservation(reservation_id: number): Promise<UsageLog> {
    const log = await this.usageLogRepository.findOne({
      where: { reservation: { reservation_id } },
      relations: ['reservation'],
    });
    if (!log) {
      throw new NotFoundException(
        `UsageLog for Reservation #${reservation_id} not found`,
      );
    }
    return log;
  }

  async update(usage_id: number, dto: UpdateUsageLogDto): Promise<UsageLog> {
    const log = await this.findOne(usage_id);
    Object.assign(log, dto);
    return this.usageLogRepository.save(log);
  }

  async remove(usage_id: number): Promise<void> {
    const result = await this.usageLogRepository.delete({ usage_id });
    if (!result.affected) {
      throw new NotFoundException(`UsageLog #${usage_id} not found`);
    }
  }
}
