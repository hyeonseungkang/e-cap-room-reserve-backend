import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/entity/admin.entity';
import { MeetingRoom } from './meeting-room/entity/meeting-room.entity';
import { RoomEquipment } from './meeting-room/entity/room-equipment.entity';
import { Reservation } from './user/entity/reservation.entity';
import { User } from './user/entity/user.entity';
import { UsageLog } from './usage-log/entity/usage-log.entity';
import { PenaltyPolicy } from './penalty/entity/penalty-policy.entity';
import { PenaltyHistory } from './penalty/entity/penalty-history.entity';
import { CancellationLog } from './cancellation-log/entity/cancellation-log.entity';
import { Question } from './qna/entity/question.entity';
import { Answer } from './qna/entity/answer.entity';
import { QnaMapping } from './qna/entity/qna-mapping.entity';
import { RoomMaintenanceLog } from './maintenance/entity/room-maintenance-log.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsageLogModule } from './usage-log/usage-log.module';
import { PenaltyModule } from './penalty/penalty.module';
import { CancellationLogModule } from './cancellation-log/cancellation-log.module';
import { QnaModule } from './qna/qna.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { UppercaseNamingStrategy } from './config/uppercase-naming.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MeetingRoomModule,
    AdminModule,
    UserModule,
    UsageLogModule,
    PenaltyModule,
    CancellationLogModule,
    QnaModule,
    MaintenanceModule,
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      namingStrategy: new UppercaseNamingStrategy(),
      synchronize: false,
      entities: [
        Admin,
        MeetingRoom,
        RoomEquipment,
        Reservation,
        User,
        UsageLog,
        PenaltyPolicy,
        PenaltyHistory,
        CancellationLog,
        Question,
        Answer,
        QnaMapping,
        RoomMaintenanceLog,
      ],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
