import { ApiProperty } from '@nestjs/swagger';

export class CreateCancellationLogDto {
  @ApiProperty()
  reservation_id: number;

  @ApiProperty()
  cancel_reason?: string;

  @ApiProperty()
  is_late_cancel?: number;
}
