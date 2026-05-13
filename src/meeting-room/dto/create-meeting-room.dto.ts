import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingRoomDto {
  @ApiProperty()
  room_name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  room_status?: string;

  @ApiProperty()
  admin_id?: number;
}
