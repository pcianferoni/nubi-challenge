import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  wallet_id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  sex_type: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  birth_date: string;

  @ApiProperty()
  created_at: string;
}
