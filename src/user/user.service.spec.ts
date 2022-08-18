import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { User } from './user.entity';
import { UserService } from './user.service';

import { JwtService } from '~src/modules/jwt/jwt.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(),
});

type Mockepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: Mockepository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('createAccount', () => {
    const createAccountResult = {
      id: 0,
      email: 'user@example.com',
      password: '',
    };
    const createAccountArgs = {
      email: 'user@example.com',
      password: '',
      name: '',
    };

    it('should fail if user already exists', async () => {
      userRepository.findOne.mockReturnValue(createAccountResult);

      await expect(service.createUser(createAccountArgs)).rejects.toThrow(ConflictException);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledTimes(0);
      expect(userRepository.save).toHaveBeenCalledTimes(0);
    });

    it('should create a new user', async () => {
      userRepository.findOne.mockReturnValue(null);
      userRepository.create.mockReturnValue(createAccountResult);
      userRepository.save.mockReturnValue(createAccountResult);

      const createResult = await service.createUser(createAccountArgs);

      expect(createResult).toBe(true);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    const findResult = (isPasswordValid: boolean) => ({
      email: 'user@example.com',
      password: '',
      name: '',
      checkPassword: jest.fn(() => Promise.resolve(isPasswordValid)),
    });

    const loginArgs = {
      email: 'user@example.com',
      password: '',
    };

    it('should fail if user not exists', async () => {
      userRepository.findOne.mockReturnValue(null);

      await expect(service.login(loginArgs)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toBeCalledTimes(1);
    });

    it('should fail if password invalid', async () => {
      userRepository.findOne.mockReturnValue(findResult(false));

      await expect(service.login(loginArgs)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should success login', async () => {
      userRepository.findOne.mockReturnValue(findResult(true));
      jwtService;

      const loginResult = await service.login(loginArgs);

      expect(loginResult).toEqual('signed-token');
      expect(userRepository.findOne).toBeCalledTimes(1);
    });
  });

  // describe('findById', async () => {

  // });
});
