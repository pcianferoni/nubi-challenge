import * as jwt from 'jsonwebtoken';
import { IAuthTokenResult, ITokenDecoder } from 'src/auth/interfaces/auth.interface';

export const tokenDecoder = (token: string): ITokenDecoder | string => {
  try {
    const decode = jwt.decode(token) as IAuthTokenResult;
    const currentDate = new Date();
    const expiresDate = new Date(decode.exp);
    return {
      ...decode,
      isExpired: +expiresDate <= +currentDate / 1000,
    };
  } catch (error) {
    return 'invalid token';
  }
};
