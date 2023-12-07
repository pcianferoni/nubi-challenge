import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginOutput } from '../dto/login.output';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiResponse({ status: 201, type: LoginOutput, description: 'User successfully deleted' })
  async login(@Body() { email, dni }: LoginDto): Promise<LoginOutput> {
    return this.authService.validateUser(email, dni);
  }
}
