import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entity/meeting-room.entity';
import { RoomEquipment } from './entity/room-equipment.entity';
import { GuardModule } from '../guard/guard.module';

@Module({
  providers: [MeetingRoomService],
  controllers: [MeetingRoomController],
  exports: [MeetingRoomService],
  imports: [
    TypeOrmModule.forFeature([MeetingRoom, RoomEquipment]),
    GuardModule,
  ],
})
export class MeetingRoomModule {}
