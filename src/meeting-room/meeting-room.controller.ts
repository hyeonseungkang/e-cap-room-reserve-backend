import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { CreateRoomEquipmentDto } from './dto/create-room-equipment.dto';
import { UpdateRoomEquipmentDto } from './dto/update-room-equipment.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post()
  create(@Body() dto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(dto);
  }

  @Get()
  findAll() {
    return this.meetingRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.meetingRoomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMeetingRoomDto,
  ) {
    return this.meetingRoomService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.meetingRoomService.remove(id);
  }

  @Post(':id/equipment')
  addEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRoomEquipmentDto,
  ) {
    return this.meetingRoomService.addEquipment(id, dto);
  }

  @Get(':id/equipment')
  findEquipment(@Param('id', ParseIntPipe) id: number) {
    return this.meetingRoomService.findEquipment(id);
  }

  @Patch(':id/equipment/:equipmentId')
  updateEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Body() dto: UpdateRoomEquipmentDto,
  ) {
    return this.meetingRoomService.updateEquipment(id, equipmentId, dto);
  }

  @Delete(':id/equipment/:equipmentId')
  removeEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
  ) {
    return this.meetingRoomService.removeEquipment(id, equipmentId);
  }
}
