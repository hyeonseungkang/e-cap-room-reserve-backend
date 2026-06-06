import { ApiProperty } from '@nestjs/swagger';

export class CreatePenaltyPolicyDto {
  @ApiProperty()
  penalty_type: string;

  @ApiProperty()
  penalty_reason?: string;

  @ApiProperty()
  restriction_days?: number;
}
