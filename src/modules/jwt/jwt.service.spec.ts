import { Test, TestingModule } from '@nestjs/testing';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';
import { JwtModule } from './jwt.module';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  const options: JwtModuleOptions = { privateKey: 'jwt-secret-key' };
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  let jwtToken = '';

  describe('sign', () => {
    it('JWT 인증 토큰 생성', () => {
      jwtToken = service.sign({
        id: 1,
      });

      expect(jwtToken).not.toEqual('');
    });
  });

  describe('verify', () => {
    it('잘못된 JWT 인증 토큰', () => {
      expect(() => service.verify('wrong.jwt.token')).toThrowError(JsonWebTokenError);
    });
  });

  it('정상적인 JWT 인증 토큰', () => {
    const parsedPayload = service.verify(jwtToken);

    expect(parsedPayload).not.toBeInstanceOf(String);
    expect(parsedPayload).toHaveProperty('id');
    expect((parsedPayload as JwtPayload).id).toEqual(1);
  });
});
