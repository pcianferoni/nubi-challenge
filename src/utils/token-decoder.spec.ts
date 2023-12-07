// __tests__/token-decoder.test.ts
import * as jwt from 'jsonwebtoken';
import { tokenDecoder } from './token-decoder';

jest.mock('jsonwebtoken');

describe('tokenDecoder', () => {
  it('should handle invalid token', () => {
    const decodeMock: jest.MockedFunction<typeof jwt.decode> = jwt.decode as any;
    decodeMock.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const result = tokenDecoder('invalidToken');
    expect(result).toBe('invalid token');
  });
});
