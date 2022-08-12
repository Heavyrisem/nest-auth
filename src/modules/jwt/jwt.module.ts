import { DynamicModule, Global, Module } from '@nestjs/common';

import { JwtModuleOptions } from './jwt.interface';
import { CONFIG_OPTIONS } from './jwt.constants';

import { JwtService } from '~src/modules/jwt/jwt.service';

@Module({})
@Global()
export class JwtModule {
  static ForRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
