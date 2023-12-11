import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as jwt from 'jsonwebtoken';
import { LoginOutput } from '../dto/login.output';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  public async validateUser(email: string, password: string): Promise<LoginOutput> {
    const foundUser = await this.userService.findByEmail(email);
    if (foundUser) {
      const isMatch = await argon2.verify(foundUser.password, password);
      if (!isMatch) throw new BadRequestException('Invalid credentials');
      delete foundUser.password;
      return this.generateJWT(foundUser, process.env.JWT_SECRET, '1h');
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
