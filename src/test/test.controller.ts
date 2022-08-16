import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthUser } from '~src/modules/auth/auth-user.decorator';
import { AuthGuard } from '~src/modules/auth/auth.guard';
import { User } from '~src/user/user.entity';

@Controller('test')
export class TestController {
  @UseGuards(AuthGuard)
  @Get()
  test(@AuthUser() authUser: User) {
    console.log(authUser);
    return 'Hello World';
  }
}
