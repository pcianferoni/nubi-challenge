import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../shared/dto/user.dto';

export class UpdateUserOutput {
  @ApiProperty()
  user: User;

  @ApiProperty()
  message: string;
}
