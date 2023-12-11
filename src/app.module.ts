import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from './validators/validation.pipe';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
