import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return { result: await this.userService.createUser(createUserDto) };
  }

  @Post('/login')
  async login(@Body() loginUserdto: LoginUserDto) {
    return { token: await this.userService.login(loginUserdto) };
  }
}
