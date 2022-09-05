import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthUser } from '~src/modules/auth/auth-user.decorator';
import { AuthGuard } from '~src/modules/auth/auth.guard';
import { User } from '~src/user/user.entity';

@Controller('/api/test')
export class TestController {
  @UseGuards(AuthGuard)
  @Get('/admin')
  adminApi(@AuthUser() user: User) {
    return `Admin API Call Success User: ${user.email}`;
  }
}
