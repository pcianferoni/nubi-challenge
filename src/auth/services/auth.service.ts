import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as jwt from 'jsonwebtoken';
import { LoginOutput } from '../dto/login.output';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  public async validateUser(email: string, dni: string): Promise<LoginOutput> {
    const foundUser = await this.userService.findByEmail(email);
    if (foundUser && foundUser.dni === dni) {
      return this.generateJWT(foundUser, 'secret', '1h');
    }
    throw new BadRequestException('Invalid credentials');
  }

  generateJWT(payload: any, secret: string, expires: string): LoginOutput {
    return {
      accessToken: jwt.sign(payload, secret, { expiresIn: expires }),
      user: payload,
    };
  }
}
