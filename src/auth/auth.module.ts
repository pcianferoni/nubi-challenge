import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/services/user.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [AuthService, UserService],
})
export class AuthModule {}
