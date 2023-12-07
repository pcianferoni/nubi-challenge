import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { readFile } from 'fs/promises';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { User } from 'src/shared/dto/user.dto';
import generate from '../../../bin/generate-data';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const testData: User[] = [
    {
      wallet_id: 'c50b51e3-58e3-4c6d-a2c6-26f808f32b43',
      email: 'Harmony_Bednar41@hotmail.com',
      name: 'Germaine',
      last_name: 'Kunde',
      sex_type: 'female',
      dni: '25243746',
      birth_date: '1980-03-10T14:49:45.275Z',
      created_at: '2023-05-06T16:31:45.265Z',
    },
    {
      wallet_id: 'fe7f52e8-e83e-4366-94f4-1774a36d9876',
      email: 'Grady.Kassulke74@yahoo.com',
      name: 'Augustine',
      last_name: 'Mosciski',
      sex_type: 'male',
      dni: '25881349',
      birth_date: '1969-06-14T16:02:41.140Z',
      created_at: '2023-10-11T05:13:22.316Z',
    },
  ];

  const testFilePath = path.join(__dirname, '/../../../data/users.json');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    userRepository = module.get<UserRepository>(UserRepository);
    // Write test data to a temporary file
    writeFileSync(testFilePath, JSON.stringify(testData));
  });

  afterAll(() => {
    generate();
  });

  describe('writeFile', () => {
    it('should write data to file', async () => {
      const newData: any = [
        {
          wallet_id: '38d611df-9a73-40a5-b085-f47c29dd55aa',
          email: 'Kayleigh15@gmail.com',
          name: 'Braxton',
          last_name: 'Williamson',
          sex_type: 'female',
          dni: '86225288',
          birth_date: '1985-10-24T23:02:57.839Z',
          created_at: '2023-04-18T09:42:36.896Z',
        },
      ];

      await expect(userRepository.writeFile(newData)).resolves.toBe(true);
      const fileContent = await readFile(testFilePath, 'utf8');
      const parsedData = JSON.parse(fileContent);
      expect(parsedData).toEqual(newData);
    });
  });

  describe('getUsersFromFile', () => {
    it('should read data from file', async () => {
      await expect(userRepository.getUsersFromFile()).resolves.toEqual(testData);
    });
  });
});
