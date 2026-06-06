import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancellationLog } from './entity/cancellation-log.entity';
import { CancellationLogService } from './cancellation-log.service';
import { CancellationLogController } from './cancellation-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CancellationLog])],
  providers: [CancellationLogService],
  controllers: [CancellationLogController],
  exports: [CancellationLogService],
})
export class CancellationLogModule {}
