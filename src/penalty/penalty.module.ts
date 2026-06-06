import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyPolicy } from './entity/penalty-policy.entity';
import { PenaltyHistory } from './entity/penalty-history.entity';
import { PenaltyService } from './penalty.service';
import { PenaltyController } from './penalty.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PenaltyPolicy, PenaltyHistory])],
  providers: [PenaltyService],
  controllers: [PenaltyController],
  exports: [PenaltyService],
})
export class PenaltyModule {}
