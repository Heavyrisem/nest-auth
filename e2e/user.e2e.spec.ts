import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '~src/app.module';
import { CreateUserDto } from '~src/user/dto/create-user.dto';
import { LoginUserDto } from '~src/user/dto/login-user.dto';
import { User } from '~src/user/user.entity';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = app.get(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let jwtToken = '';
  const testUser = {
    email: 'test@example.com',
    name: 'testUser',
    password: 'password',
  };

  describe('register', () => {
    it('유저 생성 성공', async () => {
      const createUserDto = new CreateUserDto(testUser.email, testUser.name, testUser.password);

      return request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto)
        .expect(201)
        .expect((res) => expect(res.body.result).toEqual(true));
    });

    it('유저가 이미 존재하면 유저 생성 실패', async () => {
      const createUserDto = new CreateUserDto(testUser.email, testUser.name, testUser.password);

      return request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto)
        .expect(409)
        .expect((res) => {
          expect(res.body.error).toEqual('Conflict');
          expect(res.body.message).toEqual('Account Already Exists');
        });
    });
  });

  describe('login', () => {
    it('로그인 성공', async () => {
      const loginUserDto = new LoginUserDto(testUser.email, testUser.password);

      return request(app.getHttpServer())
        .post('/user/login')
        .send(loginUserDto)
        .expect((res) => {
          expect(res.body.token).toEqual(expect.any(String));
          jwtToken = res.body.token;
        });
    });

    it('이메일이 틀리면 로그인 실패', async () => {
      const loginUserdto = new LoginUserDto('wrong email', testUser.password);

      return request(app.getHttpServer())
        .post('/user/login')
        .send(loginUserdto)
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toEqual('Not Found');
          expect(res.body.message).toEqual('User Not Found');
        });
    });

    it('패스워드가 틀리면 로그인 실패', async () => {
      const loginUserDto = new LoginUserDto(testUser.email, 'wrong password');

      return request(app.getHttpServer())
        .post('/user/login')
        .send(loginUserDto)
        .expect(401)
        .expect((res) => {
          expect(res.body.error).toEqual('Unauthorized');
          expect(res.body.message).toEqual('Password is Wrong');
        });
    });
  });

  describe('userProfile', () => {
    it('인증 토큰이 없으면 유저 프로필 조회 실패', async () => {
      return request(app.getHttpServer())
        .get('/user')
        .expect(403)
        .expect((res) => {
          expect(res.body.error).toEqual('Forbidden');
          expect(res.body.message).toEqual('Forbidden resource');
        });
    });

    it('잘못된 인증 토큰이면 유저 프로필 조회 실패', async () => {
      return request(app.getHttpServer())
        .get('/user')
        .set('authorization', 'invalidJwtToken')
        .expect(403)
        .expect((res) => {
          expect(res.body.error).toEqual('Forbidden');
          expect(res.body.message).toEqual('JwtToken verify failed');
        });
    });

    it('유저 프로필 조회 성공', async () => {
      const [{ id: userId }] = await userRepository.find({});

      return request(app.getHttpServer())
        .get('/user')
        .set('authorization', jwtToken)
        .expect(200)
        .expect((res) => {
          const user = res.body as User;
          expect(user.id).toEqual(userId);
          expect(user.password).toBeUndefined();
        });
    });
  });
});
