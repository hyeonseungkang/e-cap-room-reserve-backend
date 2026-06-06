import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomMaintenanceLog } from './entity/room-maintenance-log.entity';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';
import { UpdateMaintenanceLogDto } from './dto/update-maintenance-log.dto';
import { MeetingRoom } from '../meeting-room/entity/meeting-room.entity';
import { Admin } from '../admin/entity/admin.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(RoomMaintenanceLog)
    private readonly maintenanceRepository: Repository<RoomMaintenanceLog>,
  ) {}

  create(dto: CreateMaintenanceLogDto): Promise<RoomMaintenanceLog> {
    const { room_id, admin_id, ...rest } = dto;
    const log = this.maintenanceRepository.create(rest);
    log.room = { room_id } as MeetingRoom;
    log.admin = admin_id ? ({ admin_id } as Admin) : null;
    return this.maintenanceRepository.save(log);
  }

  findAll(): Promise<RoomMaintenanceLog[]> {
    return this.maintenanceRepository.find({ relations: ['room', 'admin'] });
  }

  async findOne(maintenance_id: number): Promise<RoomMaintenanceLog> {
    const log = await this.maintenanceRepository.findOne({
      where: { maintenance_id },
      relations: ['room', 'admin'],
    });
    if (!log) {
      throw new NotFoundException(
        `RoomMaintenanceLog #${maintenance_id} not found`,
      );
    }
    return log;
  }

  findByRoom(room_id: number): Promise<RoomMaintenanceLog[]> {
    return this.maintenanceRepository.find({
      where: { room: { room_id } },
      relations: ['room', 'admin'],
    });
  }

  async update(
    maintenance_id: number,
    dto: UpdateMaintenanceLogDto,
  ): Promise<RoomMaintenanceLog> {
    const log = await this.findOne(maintenance_id);
    const { admin_id, ...rest } = dto;
    Object.assign(log, rest);
    if (admin_id !== undefined) {
      log.admin = admin_id ? ({ admin_id } as Admin) : null;
    }
    return this.maintenanceRepository.save(log);
  }

  async remove(maintenance_id: number): Promise<void> {
    const result = await this.maintenanceRepository.delete({ maintenance_id });
    if (!result.affected) {
      throw new NotFoundException(
        `RoomMaintenanceLog #${maintenance_id} not found`,
      );
    }
  }
}
