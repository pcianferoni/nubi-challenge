import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationPipe],
    }).compile();

    validationPipe = module.get<ValidationPipe>(ValidationPipe);
  });

  it('should transform valid input without throwing an exception', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await validationPipe.transform(input, { type: 'body' });

    expect(result).toEqual(input);
  });
});
