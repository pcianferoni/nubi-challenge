import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email required',
    default: 'user@example.com',
    type: 'string',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User doc number required',
    default: '00000000',
    type: 'string',
  })
  dni: string;
}
