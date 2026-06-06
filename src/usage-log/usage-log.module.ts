import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageLog } from './entity/usage-log.entity';
import { UsageLogService } from './usage-log.service';
import { UsageLogController } from './usage-log.controller';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsageLog]), GuardModule],
  providers: [UsageLogService],
  controllers: [UsageLogController],
  exports: [UsageLogService],
})
export class UsageLogModule {}
