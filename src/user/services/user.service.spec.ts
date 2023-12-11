import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/shared/dto/user.dto';
import { FindUserOutput } from '../dto/find-user.output';
import { IMatchingCriteria } from '../interfaces/matching.interface';
import { IPagination } from '../interfaces/pagination.interface';
import { ISorting } from '../interfaces/sorting.interface';
import { SortingDirection } from '../../constants/sorting';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('should create a user', () => {
      const createUserDto: CreateUserDto = {
        wallet_id: '',
        email: 'test@example.com',
        name: '',
        password: 'hash',
        last_name: '',
        sex_type: '',
        dni: '',
        birth_date: '',
      };
      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValue([]);
      userService.create(createUserDto, (error, user) => {
        expect(error).toBeNull();
        expect(user).toBeDefined();
      });
    });
    it('should handle email already exists', (done) => {
      const createUserDto: CreateUserDto = {
        wallet_id: '',
        email: 'test_user@yahoo.com',
        name: '',
        password: 'hash',
        last_name: '',
        sex_type: '',
        dni: '',
        birth_date: '',
      };
      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValue([
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test_user@yahoo.com',
          name: 'User',
          last_name: 'Test',
          password: 'hash',
          sex_type: 'female',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ]);
      userService.create(createUserDto, (error, user) => {
        expect(error).toEqual('email already exists');
        expect(user).toBeUndefined();
        done();
      });
    });
  });

  describe('update', () => {
    it('should call repository method with the found user updated by the input', async () => {
      const email = 'test@example.com';
      const updateUserDto: UpdateUserDto = {
        name: 'Pablo',
      };
      const mockUsers = [
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test@example.com',
          name: 'Test',
          last_name: 'Test',
          password: 'hash',
          sex_type: 'female',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];
      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValue(mockUsers);
      jest.spyOn(userRepository, 'writeFile').mockResolvedValue(true);
      const updatedUser = await userService.update(email, updateUserDto);
      expect(userRepository.writeFile).toHaveBeenCalledWith([
        { ...mockUsers[0], ...updateUserDto },
      ]);
      expect(updatedUser).toEqual({ ...mockUsers[0] });
    });

    it('should throw NotFoundException for non-existing user', async () => {
      const email = 'nonexistent@example.com';
      const updateUserDto: UpdateUserDto = {};
      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValue([]);

      await expect(userService.update(email, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('find', () => {
    it('should find users with pagination, sorting, and matching', async () => {
      const pagination: IPagination = { page: 1, limit: 5 };
      const sorting: ISorting = { sortBy: 'name', sortDirection: 'ascending' };
      const matching: IMatchingCriteria = { sex_type: 'male' };

      const users: User[] = [
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test@example.com',
          name: 'Test',
          last_name: 'Test',
          password: 'hash',
          sex_type: 'male',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValueOnce(users);

      const result: FindUserOutput = await userService.find(pagination, sorting, matching);
      expect(result).toEqual(
        expect.objectContaining({
          records: expect.any(Array),
          totalRecords: expect.any(Number),
          page: expect.any(Number),
          totalPages: expect.any(Number),
          recordsPerPage: expect.any(Number),
        }),
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const userEmail = 'test@example.com';
      const users: User[] = [
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test@example.com',
          name: 'User',
          last_name: 'Test',
          sex_type: 'female',
          password: 'hash',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValueOnce(users);

      const result: User = await userService.findByEmail(userEmail);

      expect(result).toEqual(expect.objectContaining({ email: userEmail }));
    });

    it('should throw NotFoundException for non-existing user by email', async () => {
      const nonExistingUserEmail = 'nonexistent@mail.com';
      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValueOnce([]);

      await expect(userService.findByEmail(nonExistingUserEmail)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('remove', () => {
    it('should return a message when an user is removed', async () => {
      const userEmailToRemove = 'test@example.com';
      const users: User[] = [
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test@example.com',
          name: 'User',
          last_name: 'Test',
          sex_type: 'female',
          password: 'hash',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValueOnce(users);
      jest.spyOn(userRepository, 'writeFile').mockResolvedValueOnce(true);
      const result: { message: string } = await userService.remove(userEmailToRemove);

      // Assert
      expect(result).toHaveProperty('message');
      expect(result.message).toEqual('user deleted!');
    });

    it('should throw NotFoundException for non-existing user to remove', async () => {
      const nonExistingUserEmailToRemove = 'nonexistent@mail.com';
      jest.spyOn(userRepository, 'getUsersFromFile').mockResolvedValueOnce([]);

      // Assert
      await expect(userService.remove(nonExistingUserEmailToRemove)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('applyMatching', () => {
    it('should filter users based on matching criteria', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'wwallace@example.com',
          name: 'William',
          last_name: 'Wallace',
          password: 'hash',
          sex_type: 'male',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test@example.com',
          name: 'Juana',
          password: 'hash',
          last_name: 'De Arco',
          sex_type: 'female',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      const matchingCriteria: IMatchingCriteria = { sex_type: 'female' };
      const result: User[] = userService['applyMatching'](users, matchingCriteria);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Juana');
    });

    it('should return users without applying matching when matching is undefined', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'john@example.com',
          name: 'John',
          last_name: 'Doe',
          password: 'hash',
          sex_type: 'male',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      const result: User[] = userService['applyMatching'](users);

      expect(result).toEqual(users);
    });
  });

  describe('applyPagination', () => {
    it('should apply pagination to user. number of records should be less or equal than limit', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'wwallace@example.com',
          name: 'William',
          last_name: 'Wallace',
          sex_type: 'male',
          password: 'hash',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'juana@example.com',
          name: 'Juana',
          last_name: 'De Arco',
          sex_type: 'female',
          password: 'hash',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
        {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'gengis@example.com',
          name: 'Gengis Khan',
          last_name: 'Khan',
          sex_type: 'male',
          password: 'hash',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      const pagination: IPagination = { page: 1, limit: 2 };

      const result: User[] = userService['applyPagination'](users, pagination);
      expect(result).toHaveLength(2);
      expect(result.length).toBeLessThanOrEqual(pagination.limit);
    });

    it('should return users without applying pagination when pagination is undefined', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'john@example.com',
          name: 'John',
          last_name: 'Doe',
          sex_type: 'male',
          password: 'hash',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      const result: User[] = userService['applyPagination'](users, undefined);

      expect(result).toEqual(users);
    });
  });

  describe('applySorting', () => {
    it('should apply sorting to users', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'john@example.com',
          name: 'John',
          last_name: 'Doe',
          sex_type: 'male',
          password: 'hash',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
        {
          wallet_id: '2',
          email: 'jane@example.com',
          name: 'Jane',
          last_name: 'Doe',
          password: 'hash',
          sex_type: 'female',
          dni: '87654321',
          birth_date: '1995-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:25:48.518Z',
        },
      ];

      const sorting: ISorting = { sortBy: 'created_at', sortDirection: 'ascending' };

      const result: User[] = userService['applySorting'](users, sorting);

      expect(result[0].name).toBe('John');
      expect(result[1].name).toBe('Jane');
    });

    it('should apply sorting to users', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'john@example.com',
          name: 'John',
          last_name: 'Doe',
          sex_type: 'male',
          dni: '12345678',
          password: 'hash',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
        {
          wallet_id: '2',
          email: 'jane@example.com',
          name: 'Jane',
          last_name: 'Doe',
          sex_type: 'female',
          password: 'hash',
          dni: '87654321',
          birth_date: '1995-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:25:48.518Z',
        },
      ];

      const sorting: ISorting = { sortBy: 'created_at', sortDirection: 'descending' };

      const result: User[] = userService['applySorting'](users, sorting);

      expect(result[0].name).toBe('Jane');
      expect(result[1].name).toBe('John');
    });

    it('should return users without applying sorting when sorting is undefined', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'john@example.com',
          name: 'John',
          last_name: 'Doe',
          sex_type: 'male',
          password: 'hash',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      const result: User[] = userService['applySorting'](users, undefined);

      expect(result).toEqual(users);
    });

    it('should return users without applying sorting when sortBy is undefined', () => {
      const users: User[] = [
        {
          wallet_id: '1',
          email: 'john@example.com',
          name: 'John',
          last_name: 'Doe',
          password: 'hash',
          sex_type: 'male',
          dni: '12345678',
          birth_date: '1990-01-01T00:00:00.000Z',
          created_at: '2023-08-12T10:23:48.518Z',
        },
      ];

      const sorting = { sortBy: undefined, sortDirection: SortingDirection.ascending };

      const result: User[] = userService['applySorting'](users, sorting);

      expect(result).toEqual(users);
    });
  });
});
