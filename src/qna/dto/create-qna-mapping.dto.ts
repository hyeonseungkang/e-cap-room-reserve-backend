import { ApiProperty } from '@nestjs/swagger';

export class CreateQnaMappingDto {
  @ApiProperty()
  question_id: number;

  @ApiProperty()
  answer_id: number;
}
