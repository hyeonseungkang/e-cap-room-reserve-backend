import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomEquipmentDto {
  @ApiProperty()
  equipment_name: string;

  @ApiProperty()
  quantity?: number;
}
