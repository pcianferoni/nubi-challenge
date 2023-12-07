import { User } from 'src/shared/dto/user.dto';

export interface IAuthTokenResult extends User {
  iat: number;
  exp: number;
}

export interface ITokenDecoder extends IAuthTokenResult {
  isExpired: boolean;
}
