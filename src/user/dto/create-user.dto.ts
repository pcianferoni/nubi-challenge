import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'wallet id associated with the user',
    type: 'string',
  })
  wallet_id: string;

  @IsEmail()
  @ApiProperty({
    description: 'user email. It will be required to log in',
    default: 'user@example.com',
    type: 'string',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'user first name',
    default: 'Mohammed',
    type: 'string',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'user last name',
    default: 'Salah',
    type: 'string',
  })
  last_name: string;

  @IsString()
  @ApiProperty({
    description: 'user gender',
    default: 'Male',
    type: 'string',
  })
  sex_type: string;

  @IsString()
  @ApiProperty({
    description: 'user document number. It will be required to log in',
    default: '00000000',
    type: 'string',
  })
  dni: string;

  @IsString()
  @ApiProperty({
    description: 'user birthdate',
    type: 'string',
  })
  birth_date: string;
}
