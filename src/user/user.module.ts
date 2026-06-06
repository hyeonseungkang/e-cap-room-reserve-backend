import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity';
import { User } from './entity/user.entity';
import { GuardModule } from '../guard/guard.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([Reservation, User]), GuardModule],
  exports: [UserService],
})
export class UserModule {}
