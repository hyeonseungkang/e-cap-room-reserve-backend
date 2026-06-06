import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancellationLog } from './entity/cancellation-log.entity';
import { CancellationLogService } from './cancellation-log.service';
import { CancellationLogController } from './cancellation-log.controller';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [TypeOrmModule.forFeature([CancellationLog]), GuardModule],
  providers: [CancellationLogService],
  controllers: [CancellationLogController],
  exports: [CancellationLogService],
})
export class CancellationLogModule {}
