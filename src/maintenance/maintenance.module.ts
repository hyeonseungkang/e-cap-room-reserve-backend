import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMaintenanceLog } from './entity/room-maintenance-log.entity';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomMaintenanceLog]), GuardModule],
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
