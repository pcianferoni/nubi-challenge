import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserService } from '../../user/services/user.service';
import { UnauthorizedException } from '@nestjs/common';

const userServiceMock = {
  findByEmail: jest.fn(),
};

const reflectorMock = {
  get: jest.fn(),
};

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should allow access to public endpoint', async () => {
    reflectorMock.get.mockReturnValueOnce(true);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const result = await guard.canActivate({
      getHandler: () => null,
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as any);

    expect(result).toEqual(true);
  });

  it('should throw UnauthorizedException for missing token', async () => {
    reflectorMock.get.mockReturnValueOnce(false);
    await expect(
      guard.canActivate({
        getHandler: () => null,
        switchToHttp: () => ({
          getRequest: () => ({ headers: {} }),
        }),
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });
});
