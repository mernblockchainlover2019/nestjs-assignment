import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';

describe('Auth', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  it('/POST auth/login', async () => {
    const user = { username: 'testuser', password: 'testpassword' };
    await authService.register(user);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('access_token');
      });
  });

  it('/POST auth/register', () => {
    const newUser = { username: 'newuser', password: 'newpassword' };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('username', newUser.username);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});