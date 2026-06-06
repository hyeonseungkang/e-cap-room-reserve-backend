import { ApiProperty } from '@nestjs/swagger';

export class UpdatePenaltyPolicyDto {
  @ApiProperty()
  penalty_type?: string;

  @ApiProperty()
  penalty_reason?: string;

  @ApiProperty()
  restriction_days?: number;
}
