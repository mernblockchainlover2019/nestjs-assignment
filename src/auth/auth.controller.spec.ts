import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          }
        }
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const user = { username: 'testuser', password: 'testpassword' };
      const accessToken = 'generated-access-token';

      jest.spyOn(authService, 'login').mockResolvedValue({ access_token: accessToken });

      const result = await authController.login(user);

      expect(result).toEqual({ access_token: accessToken });
    });
  });

  describe('register', () => {
    it('should return the registered user', async () => {
      const user = { username: 'testuser', password: 'testpassword' };
      const registeredUser = { ...user, id: 1 }; // Assuming the user is registered with an ID

      jest.spyOn(authService, 'register').mockResolvedValue(registeredUser);

      const result = await authController.register(user);

      expect(result).toEqual(registeredUser);
    });
  });
});
