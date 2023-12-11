import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import * as argon2 from 'argon2';

jest.mock('../../user/services/user.service'); // Mock UserService para controlar el comportamiento de findByEmail

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('validateUser', () => {
    it('should throw BadRequestException for user not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      //Assert
      await expect(
        authService.validateUser('nonexistent@example.com', 'invalidPassword'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for incorrect password', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue({
        email: 'test@example.com',
        password: await argon2.hash('hash'),
        wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
        name: 'User',
        last_name: 'Test',
        sex_type: 'female',
        dni: '19569561',
        birth_date: '1946-06-24T03:50:41.706Z',
        created_at: '2023-08-12T10:23:48.518Z',
      });
      //Assert
      await expect(authService.validateUser('test@example.com', 'invalidPassword')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a LoginOutput for valid credentials', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: await argon2.hash('correctPassword'),
        wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
        name: 'User',
        last_name: 'Test',
        sex_type: 'female',
        dni: '19569561',
        birth_date: '1946-06-24T03:50:41.706Z',
        created_at: '2023-08-12T10:23:48.518Z',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      const result = await authService.validateUser('test@example.com', 'correctPassword');
      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.user).toEqual(expect.objectContaining(mockUser));
    });
  });

  describe('generateJWT', () => {
    it('should generate a JWT token', () => {
      const payload = { userId: 1, username: 'testuser' };
      const secret = 'test-secret';
      const expires = '1h';

      const result = authService.generateJWT(payload, secret, expires);

      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.user).toEqual(expect.objectContaining(payload));
    });
  });
});
