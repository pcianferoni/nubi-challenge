import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IPagination } from '../interfaces/pagination.interface';
import { ISorting } from '../interfaces/sorting.interface';
import { IMatchingCriteria } from '../interfaces/matching.interface';
import { FindUserOutput } from '../dto/find-user.output';
import { User } from 'src/shared/dto/user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserInput: CreateUserDto, callback: (error: any, user?: User) => void): void {
    this.userRepository
      .getUsersFromFile()
      .then((users) => {
        const isAnExistingUserEmail = users.some((user) => user.email === createUserInput.email);

        if (isAnExistingUserEmail) {
          callback('email already exists');
        } else {
          argon2
            .hash(createUserInput.password)
            .then((hashedPassword) => {
              const userToCreate = {
                ...createUserInput,
                password: hashedPassword,
                created_at: new Date().toISOString(),
              };

              users.push(userToCreate);

              this.userRepository
                .writeFile(users)
                .then(() => {
                  delete userToCreate.password;
                  callback(null, userToCreate);
                })
                .catch((_error) =>
                  callback(
                    new InternalServerErrorException('An error occurred while writing the file'),
                  ),
                );
            })
            .catch((_error) =>
              callback(
                new InternalServerErrorException('An error occurred while hashing the password'),
              ),
            );
        }
      })
      .catch((_error) => callback(new InternalServerErrorException('An error occurred')));
  }

  update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository
      .getUsersFromFile()
      .then((users) => {
        const userToUpdate = users.find((user) => user.email === email);
        if (userToUpdate) {
          Object.assign(userToUpdate, { ...updateUserDto, email });
          return this.userRepository.writeFile(users).then(() => userToUpdate);
        }
        return Promise.reject(new NotFoundException(`User not found`));
      })
      .catch((error) => Promise.reject(error));
  }

  async find(pagination, sorting, matching): Promise<FindUserOutput> {
    let users = await this.userRepository.getUsersFromFile();
    users = this.applyMatching(users, matching);
    const totalRecords = users.length;
    users = this.applySorting(users, sorting);
    users = this.applyPagination(users, pagination);

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const totalPages = Math.ceil(totalRecords / limit);

    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    return {
      page,
      totalPages,
      records: paginatedUsers,
      recordsPerPage: limit,
      totalRecords,
    };
  }

  public async findByEmail(email): Promise<User> {
    const users = await this.userRepository.getUsersFromFile();
    const foundUser = users.find((user) => user.email === email);
    if (!foundUser) throw new NotFoundException('user not found');
    return foundUser;
  }

  async remove(email: string): Promise<{ message: string }> {
    const users = await this.userRepository.getUsersFromFile();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      await this.userRepository.writeFile(users);
      return { message: 'user deleted!' };
    }
    throw new NotFoundException(`user not found`);
  }

  private applyMatching(users: User[], matching?: IMatchingCriteria) {
    if (!matching) {
      return users;
    }

    return users.filter((user) => {
      for (const key in matching) {
        if (user[key] !== matching[key]) {
          return false;
        }
      }
      return true;
    });
  }

  private applyPagination(users: User[], pagination: IPagination) {
    if (!pagination) {
      return users;
    }

    const { page = 1, limit = 10 } = pagination;
    const startIndex = (page - 1) * limit;
    return users.slice(startIndex, startIndex + limit);
  }

  private applySorting(users: User[], sorting: ISorting) {
    if (!sorting) {
      return users;
    }

    const { sortBy, sortDirection } = sorting;
    if (sortBy) {
      return users.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortDirection === 'ascending') {
          return aValue.localeCompare(bValue);
        } else if (sortDirection === 'descending') {
          return bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return users;
  }
}
