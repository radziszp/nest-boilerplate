import { UserService } from '@user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@user/entities/user.entity';

describe('AuthServiceA', () => {
  const user = { email: 'email', password: 'password' } as UserEntity;

  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: () => ({
            create: jest.fn(),
            findByLogin: jest.fn(),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn(),
          }),
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  describe('register()', () => {
    it('should return created user', () => {
      const createSpy = jest
        .spyOn(userService, 'create')
        .mockReturnValue(Promise.resolve(user));

      const result = authService.register(user);

      expect(result).toEqual(result);

      createSpy.mockRestore();
    });
  });

  describe('login()', () => {
    it('should return token', async () => {
      const token = 'token';
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      const findByLoginSpy = jest
        .spyOn(userService, 'findByLogin')
        .mockReturnValue(Promise.resolve(user));

      const result = await authService.login(user);

      expect(result).toEqual(token);

      signSpy.mockRestore();
      findByLoginSpy.mockRestore();
    });
  });
});
