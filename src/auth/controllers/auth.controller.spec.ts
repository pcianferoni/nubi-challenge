import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginOutput } from '../dto/login.output';
import { UserService } from '../../user/services/user.service';
import { UserRepository } from '../../user/repositories/user.repository';

const userRepositoryMock = {
  writeFile: jest.fn(),
  getUsersFromFile: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return login output on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'hash',
      };

      const expectedLoginOutput: LoginOutput = {
        accessToken: 'your_generated_token',
        user: {
          wallet_id: '',
          email: 'test@example.com',
          name: '',
          password: 'hash',
          last_name: '',
          sex_type: '',
          dni: '12345678',
          birth_date: '',
          created_at: '',
        },
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(expectedLoginOutput);
      const result: LoginOutput = await authController.login(loginDto);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user', expectedLoginOutput.user);
    });
  });
});
