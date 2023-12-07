import { User } from '../../shared/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginOutput {
  @ApiProperty({ description: 'user access token' })
  accessToken: string;

  @ApiProperty({ type: User, description: 'user payload' })
  user: User;
}
