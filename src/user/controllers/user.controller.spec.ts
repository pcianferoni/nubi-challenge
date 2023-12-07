import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { FindUserOutput } from '../dto/find-user.output';
import { UserRepository } from '../repositories/user.repository';
import { SortingDirection } from '../../constants/sorting';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should call create method with correct parameters and return success message', async () => {
      const mockCreateUserDto: CreateUserDto = {
        wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
        email: 'test_user@yahoo.com',
        name: 'User',
        last_name: 'Test',
        sex_type: 'female',
        dni: '19569561',
        birth_date: '1946-06-24T03:50:41.706Z',
      };

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(userService, 'create').mockImplementation((dto, callback) => {
        callback(null, {
          wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
          email: 'test_user@yahoo.com',
          name: 'User',
          last_name: 'Test',
          sex_type: 'female',
          dni: '19569561',
          birth_date: '1946-06-24T03:50:41.706Z',
          created_at: '2023-08-12T10:23:48.518Z',
        });
      });

      await controller.create(mockCreateUserDto, responseMock);

      // Assert
      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto, expect.any(Function));
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({
        user: expect.any(Object),
        message: 'User created!',
      });
    });

    it('should handle error when create method fails', async () => {
      const mockCreateUserDto: CreateUserDto = {
        wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
        email: 'test_user@yahoo.com',
        name: 'User',
        last_name: 'Test',
        sex_type: 'female',
        dni: '19569561',
        birth_date: '1946-06-24T03:50:41.706Z',
      };

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(userService, 'create').mockImplementation((dto, callback) => {
        callback('Some error occurred');
      });

      await controller.create(mockCreateUserDto, responseMock);

      // Assert
      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto, expect.any(Function));
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.json).toHaveBeenCalledWith({ error: 'Some error occurred' });
    });
  });

  describe('find', () => {
    it('should call find method with correct parameters and return records with pagination', async () => {
      const mockPagination = { page: '1', limit: '10' };
      const mockSorting = { sortBy: 'name', sortDirection: SortingDirection.ascending };
      const mockMatching = { email: 'test@example.com' };

      const findUserOutput: FindUserOutput = {
        page: 1,
        totalPages: 1,
        recordsPerPage: 10,
        totalRecords: 1,
        records: [
          {
            wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
            email: 'test@example.com',
            name: 'Juana',
            last_name: 'De Arco',
            sex_type: 'female',
            dni: '19569561',
            birth_date: '1946-06-24T03:50:41.706Z',
            created_at: '2023-08-12T10:23:48.518Z',
          },
        ],
      };
      jest.spyOn(userService, 'find').mockResolvedValue(findUserOutput);

      const result = await controller.find(
        mockPagination.page,
        mockPagination.limit,
        mockSorting.sortBy,
        mockSorting.sortDirection,
        mockMatching,
      );

      // Assert
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
      expect(result).toHaveProperty('recordsPerPage');
      expect(result).toHaveProperty('totalRecords');
      expect(result).toHaveProperty('records');
      expect(userService.find).toHaveBeenCalledWith(mockPagination, mockSorting, mockMatching);
    });
  });

  describe('update', () => {
    it('should call update method with correct parameters and return updated user', async () => {
      const mockEmail = 'test@example.com';
      const mockUpdateUserDto = {
        dni: '2999324',
      };

      const updatedUser = {
        wallet_id: 'c19895c2-5bd1-469a-b12b-6bcaa00643f8',
        email: 'juanadearco@yahoo.com',
        name: 'Juana',
        last_name: 'De Arco',
        sex_type: 'female',
        dni: '2999324',
        birth_date: '1946-06-24T03:50:41.706Z',
        created_at: '2023-08-12T10:23:48.518Z',
      };

      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(mockEmail, mockUpdateUserDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('user');
      expect(result.user).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(mockEmail, mockUpdateUserDto);
    });
  });

  describe('remove', () => {
    it('should call delete method with correct parameter and return success message', async () => {
      const mockEmail = 'test@example.com';
      const removeMessage = { message: 'User deleted!' };

      jest.spyOn(userService, 'remove').mockResolvedValue(removeMessage);

      const result = await controller.remove(mockEmail);

      expect(result).toHaveProperty('message');
      expect(userService.remove).toHaveBeenCalledWith(mockEmail);
    });
  });
});
