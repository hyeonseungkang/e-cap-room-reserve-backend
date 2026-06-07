import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { User } from './entity/user.entity';
import { GuardModule } from '../guard/guard.module';
import { PenaltyModule } from 'src/penalty/penalty.module';
import { MeetingRoomModule } from 'src/meeting-room/meeting-room.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([Reservation, User]),
    GuardModule,
    PenaltyModule,
    MeetingRoomModule,
  ],
  exports: [UserService],
})
export class UserModule {}
