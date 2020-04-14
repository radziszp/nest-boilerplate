import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from '../../src/config/config';
import { UserEntity } from '@user/entities/user.entity';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';

describe('TodoController (e2e)', () => {
  let app;
  let module;
  let token;
  const userProperties = ['createdOn', 'email', 'id', 'updatedOn'];
  const usersData = [{ email: 'email@o2.pl', password: 'password' }];
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(configuration.databases.postgres),
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeAll(async done => {
    const userRepository = module.get(getRepositoryToken(UserEntity));
    const userEntity = await userRepository.create(usersData);
    await userRepository.save(userEntity);
    request(app.getHttpServer())
      .post('/auth/login')
      .send(usersData[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        token = 'bearer ' + res.body.token;
        done();
      });
  });

  describe('register()', () => {
    it('should return created user', done => {
      const user = { email: 'email2@o2.pl', password: 'password' };
      request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(200)
        .end((err, res) => {
          expect(res.body.email).toEqual(user.email);
          expect(Object.keys(res.body).sort()).toEqual(userProperties);
          done();
        });
    });
  });

  describe('whoami()', () => {
    it('should return logged user data', done => {
      request(app.getHttpServer())
        .get('/auth/whoami')
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(Object.keys(res.body).sort()).toEqual(userProperties);
          done();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterAll(async () => {
    const userRepository = module.get(getRepositoryToken(UserEntity));
    await userRepository.delete({});
  });
});
