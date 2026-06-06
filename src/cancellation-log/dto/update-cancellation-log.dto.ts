import { ApiProperty } from '@nestjs/swagger';

export class UpdateCancellationLogDto {
  @ApiProperty()
  cancel_reason?: string;

  @ApiProperty()
  is_late_cancel?: number;
}
