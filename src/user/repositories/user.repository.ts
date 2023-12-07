import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { writeFileSync } from 'fs';
import { User } from 'src/shared/dto/user.dto';

const pathFile = '/../../data/users.json';

@Injectable()
export class UserRepository {
  public async writeFile(data: User[]): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await writeFileSync(__dirname + pathFile, jsonData);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while writing the file');
    }
  }

  public async getUsersFromFile(): Promise<User[]> {
    try {
      const data = await readFile(__dirname + pathFile, 'utf8');
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while reading the file');
    }
  }
}
