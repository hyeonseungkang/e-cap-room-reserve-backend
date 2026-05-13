import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRoom } from './entity/meeting-room.entity';
import { RoomEquipment } from './entity/room-equipment.entity';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { CreateRoomEquipmentDto } from './dto/create-room-equipment.dto';
import { UpdateRoomEquipmentDto } from './dto/update-room-equipment.dto';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom)
    private readonly meetingRoomRepository: Repository<MeetingRoom>,
    @InjectRepository(RoomEquipment)
    private readonly roomEquipmentRepository: Repository<RoomEquipment>,
  ) {}

  create(dto: CreateMeetingRoomDto): Promise<MeetingRoom> {
    const room = this.meetingRoomRepository.create({
      ...dto,
      ...(dto.admin_id ? { admin: { admin_id: dto.admin_id } } : {}),
    });
    return this.meetingRoomRepository.save(room);
  }

  findAll(): Promise<MeetingRoom[]> {
    return this.meetingRoomRepository.find({
      relations: ['admin', 'equipment'],
    });
  }

  async findOne(room_id: number): Promise<MeetingRoom> {
    const room = await this.meetingRoomRepository.findOne({
      where: { room_id },
      relations: ['admin', 'equipment', 'reservations'],
    });

    if (!room) {
      throw new NotFoundException(`MeetingRoom #${room_id} not found`);
    }

    return room;
  }

  async update(
    room_id: number,
    dto: UpdateMeetingRoomDto,
  ): Promise<MeetingRoom> {
    const room = await this.findOne(room_id);
    const { admin_id, ...rest } = dto;
    Object.assign(room, rest);
    if (admin_id !== undefined) {
      room.admin = admin_id ? ({ admin_id } as MeetingRoom['admin']) : null!;
    }
    return this.meetingRoomRepository.save(room);
  }

  async remove(room_id: number): Promise<void> {
    const result = await this.meetingRoomRepository.delete({ room_id });

    if (!result.affected) {
      throw new NotFoundException(`MeetingRoom #${room_id} not found`);
    }
  }

  async addEquipment(
    room_id: number,
    dto: CreateRoomEquipmentDto,
  ): Promise<RoomEquipment> {
    await this.findOne(room_id);
    const equipment = this.roomEquipmentRepository.create({
      ...dto,
      room: { room_id } as RoomEquipment['room'],
    });
    return this.roomEquipmentRepository.save(equipment);
  }

  findEquipment(room_id: number): Promise<RoomEquipment[]> {
    return this.roomEquipmentRepository.find({
      where: { room: { room_id } },
    });
  }

  async updateEquipment(
    room_id: number,
    equipment_id: number,
    dto: UpdateRoomEquipmentDto,
  ): Promise<RoomEquipment> {
    const equipment = await this.roomEquipmentRepository.findOne({
      where: { equipment_id, room: { room_id } },
    });

    if (!equipment) {
      throw new NotFoundException(
        `Equipment #${equipment_id} in MeetingRoom #${room_id} not found`,
      );
    }

    Object.assign(equipment, dto);
    return this.roomEquipmentRepository.save(equipment);
  }

  async removeEquipment(room_id: number, equipment_id: number): Promise<void> {
    const result = await this.roomEquipmentRepository.delete({
      equipment_id,
      room: { room_id } as RoomEquipment['room'],
    });

    if (!result.affected) {
      throw new NotFoundException(
        `Equipment #${equipment_id} in MeetingRoom #${room_id} not found`,
      );
    }
  }
}
