import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty()
  admin_id: number;

  @ApiProperty()
  content: string;
}
