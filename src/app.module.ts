import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Admin } from './admin/entity/admin.entity';
import { MeetingRoom } from './meeting-room/entity/meeting-room.entity';
import { RoomEquipment } from './meeting-room/entity/room-equipment.entity';
import { Reservation } from './user/entity/reservation.entity';
import { User } from './user/entity/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MeetingRoomModule,
    AdminModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: resolve('data/db/db.sqlite3'),
      enableWAL: true,
      entities: [Admin, MeetingRoom, RoomEquipment, Reservation, User],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
