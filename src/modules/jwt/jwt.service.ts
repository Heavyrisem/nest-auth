import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {}

  sign(payload: object) {
    return jwt.sign(payload, this.options.privateKey, { algorithm: 'RS256' });
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey, { algorithms: ['RS256'] });
  }
}
