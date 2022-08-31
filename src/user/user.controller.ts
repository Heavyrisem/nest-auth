import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateRoleDto } from './dto/create-role.dto';

import { AuthUser } from '~src/modules/auth/auth-user.decorator';
import { AuthGuard } from '~src/modules/auth/auth.guard';

@Controller('/api/user')
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

  @Post('/role/create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return { result: await this.userService.createRole(createRoleDto) };
  }

  @UseGuards(AuthGuard)
  @Get()
  async getCurrentUser(@AuthUser() authUser: User) {
    return await this.userService.findById(authUser.id);
  }
}
