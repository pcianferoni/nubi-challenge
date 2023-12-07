import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { BadRequestException } from '@nestjs/common';
import { LoginOutput } from '../dto/login.output';
import { User } from '../../shared/dto/user.dto';

const userServiceMock = {
  findByEmail: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return an access token', async () => {
      const email = 'test@example.com';
      const dni = '12345678';

      const foundUser: User = {
        email,
        dni,
        wallet_id: '',
        name: '',
        last_name: '',
        sex_type: '',
        birth_date: '',
        created_at: '',
      };

      userServiceMock.findByEmail.mockResolvedValueOnce(foundUser);

      const result: LoginOutput = await authService.validateUser(email, dni);
      // Assert
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw BadRequestException on invalid user credentials', async () => {
      const email = 'invalid@example.com';
      const dni = 'invalid_dni';

      userServiceMock.findByEmail.mockResolvedValueOnce({
        wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
        email: 'test_user@yahoo.com',
        name: 'User',
        last_name: 'Test',
        sex_type: 'female',
        dni: '19569561',
        birth_date: '1946-06-24T03:50:41.706Z',
        created_at: '2023-08-12T10:23:48.518Z',
      });

      // Assert
      await expect(authService.validateUser(email, dni)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when dni does not match', async () => {
      const email = 'test@example.com';
      const dni = 'invalid_dni';

      const foundUser = {
        email,
        dni: '3423423',
      };
      userServiceMock.findByEmail.mockResolvedValueOnce(foundUser);

      // Assert
      await expect(authService.validateUser(email, dni)).rejects.toThrow(BadRequestException);
    });
  });
});
