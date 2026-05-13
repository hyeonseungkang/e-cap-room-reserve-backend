import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomEquipmentDto {
  @ApiProperty()
  equipment_name?: string;

  @ApiProperty()
  quantity?: number;
}
