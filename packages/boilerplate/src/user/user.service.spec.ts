import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  const email = 'email';
  const user = { email, password: 'password' } as UserEntity;

  let service: UserService;
  let repo: Repository<UserEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({
            create: () => jest.fn(),
            save: () => jest.fn(),
            findOne: () => jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get(UserService);
    repo = module.get(getRepositoryToken(UserEntity));
  });

  describe('create()', () => {
    it('should save user', async () => {
      const createSpy = jest.spyOn(repo, 'create').mockReturnValue(user);
      const saveSpy = jest.spyOn(repo, 'save');

      await service.create(user);

      expect(saveSpy).toBeCalledWith(user);

      createSpy.mockRestore();
      saveSpy.mockRestore();
    });

    it("should return sanitized user's data", async () => {
      const saveSpy = jest
        .spyOn(repo, 'save')
        .mockReturnValue(Promise.resolve(user));

      const result = await service.create(user);

      expect(result).toEqual({ email });

      saveSpy.mockRestore();
    });
  });

  describe('findByLogin()', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const findOneSpy = jest.spyOn(repo, 'findOne').mockReturnValue(null);

      const result = service.findByLogin(user);

      await expect(result).rejects.toBeInstanceOf(UnauthorizedException);

      findOneSpy.mockRestore();
    });

    it("should throw UnauthorizedException if user's password doesn't match", async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockReturnValue(false);

      const result = service.findByLogin(user);

      await expect(result).rejects.toBeInstanceOf(UnauthorizedException);

      compareSpy.mockRestore();
    });

    it("should return sanitized user's data", async () => {
      const findOneSpy = jest
        .spyOn(repo, 'findOne')
        .mockReturnValue(Promise.resolve(user));
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockReturnValue(true);

      const result = await service.findByLogin(user);

      expect(result).toEqual({ email });

      findOneSpy.mockRestore();
      compareSpy.mockRestore();
    });
  });

  describe('findByPayload()', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const findOneSpy = jest.spyOn(repo, 'findOne').mockReturnValue(null);

      const result = service.findByPayload(user);

      await expect(result).rejects.toBeInstanceOf(UnauthorizedException);

      findOneSpy.mockRestore();
    });

    it("should return sanitized user's data", async () => {
      const findOneSpy = jest
        .spyOn(repo, 'findOne')
        .mockReturnValue(Promise.resolve(user));

      const result = await service.findByPayload(user);

      expect(result).toEqual({ email });

      findOneSpy.mockRestore();
    });
  });

  describe('findOne()', () => {
    it("should return sanitized user's data", async () => {
      const findOneSpy = jest
        .spyOn(repo, 'findOne')
        .mockReturnValue(Promise.resolve(user));

      const result = await service.findOne(user);

      expect(result).toEqual({ email });

      findOneSpy.mockRestore();
    });
  });
});
