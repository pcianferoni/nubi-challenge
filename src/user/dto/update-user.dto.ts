import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiPropertyOptional({
    description: 'wallet id associated with the user',
    type: 'string',
  })
  wallet_id?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'user first name',
    default: 'Mohammed',
    type: 'string',
  })
  name?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'user last name',
    default: 'Salah',
    type: 'string',
  })
  last_name?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'user gender',
    default: 'Male',
    type: 'string',
  })
  sex_type?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'user document number. It will be required to log in',
    default: '00000000',
    type: 'string',
  })
  dni?: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'user birthdate',
    type: 'string',
  })
  birth_date?: string;
}
